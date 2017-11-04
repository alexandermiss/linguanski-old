/**
 * Post.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

module.exports = {
  schema: true,
  attributes: {
    user: {model: 'user'},
  	post_type: {
      type: 'string',
      enum: ['p', 'c', 's'], // Post, Comment, Share
    },
  	post_text: {type: 'string'},

    traduction: {model: 'traduction'},
    conversation: {model: 'conversation'},

    comments: {
      collection: 'post',
      via: 'posts',
      dominant: true
    },
    posts: {
      collection: 'post',
      via: 'comments'
    },
    likes: {
      collection: 'like',
      via: 'post'
    }

  },

  listPost: function (){

    return Post.find({}).populate('user').then(function(posts){
      this.posts = post;
      return Traduction.find({id: _.map(post, 'traduction')});
    })
    .then(function(trads){
      var post = this.post;
      return Setting.find({user: _.map(post, 'user')});
    })
    .catch(function(err){
      sails.log.debug('LISTPOST ERR\n', err);
      return err;
    });

  },

  addPost: function (opts){

    if(opts.phrase_id){

    }else{

      return Traduction.create({comment_text: new Date().toJSON()}).then(function(trad){
        this.trad = trad;

        var phrases = [
          {
            phrase: opts.phrase_native,
            pronuntiation: opts.phrase_native,
            comment_text: opts.phrase_native,
            language: opts.country_language_id,
            traduction: trad.id,
            native: true
          },
          {
            phrase: opts.phrase_language,
            pronuntiation: opts.phrase_language,
            comment_text: opts.phrase_language,
            language: opts.language_id,
            traduction: trad.id,
            native: false
          }
        ];
        sails.log.debug('TRAD', trad);
        return Phrase.create(_.map(phrases, function(phra){return _.omit(phra, 'native');}));
      })
      .then(function(phrase){
        this.phrase = _.isArray(phrase) ? phrase[0] : phrase;
        var trad = this.trad;
        var _opts = _.omit(opts, 'phrase_native', 'phrase_native_flag_prefix',
                            'phrase_language', 'phrase_language_flag_prefix',
                            'phrase_id', 'user');
        _opts['user'] = opts.user.id;
        _opts = _.assign(_opts, _.omit(_.pick(opts, 'user'), 'id'));
        if(_opts.user.auth) delete _opts.user['auth'];
        this.user = _opts.user;
        this._opts = _opts;
        return Post.create(_.extend(_opts, {traduction: trad.id}));
      })
      .then(function(post){
        sails.log.debug('POST', post);
        post = _.isArray(post) ? post[0] : post;
        post['user'] = _.omit(this.user, 'createdAt', 'updatedAt', 'role', 'photo', 'activated');
        post['user']['image'] = _.pick(this._opts.image, 'photo80x80', 'secure_url');
        post['phrase'] = this.phrase;
        post = _.assign(post, _.pick(opts, 'phrase_language_flag_prefix', 'phrase_native_flag_prefix'));

        return post;
      })
      .catch(function(err){
        return err;
      });

    }

  }

};
