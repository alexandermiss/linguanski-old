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

    native: {model: 'language'},
    learning: {model: 'language'},

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

  listPost: function (opts){

    return Post.find({}).populate('native').populate('learning').skip(opts.page).limit(opts.limit).sort('createdAt DESC').then(function(posts){
      this.posts = posts;
      return Profile.find({user: _.map(posts, 'user')});
    })
    .then(function(profiles){
      this.profiles = profiles;
      return User.find({id: _.map(this.posts, 'user')}).populate('image');
    })
    .then(function(users){
      this.users    = users;
      return Phrase.find({traduction: _.map(this.posts, 'traduction')}).populate('language');
    })
    .then(function(phrases){
      var posts     = this.posts;
      var users     = this.users;
      var profiles  = this.profiles;

      posts = _.map(posts, function(post){
        post['user']    = _.find(users, {id: post['user']}) || {};
        post['profile'] = _.find(profiles, {user: post['user'].id});
        post['phrase_native'] = _.find(phrases, function(ph){
           return ph.traduction == post['traduction'] && post.native.id == ph.language.id;
         });
        post['phrase_learning'] = _.find(phrases, function(ph){
          return ph.traduction == post['traduction'] && post.learning.id == ph.language.id;
        });
        return post;
      });

      return posts;
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
        return Phrase.create(_.map(phrases, function(phra){return _.omit(phra, 'native');}));
      })
      .then(function(phrases){
        this.phrases = phrases;
        var trad = this.trad;
        var _opts = _.omit(opts, 'phrase_native', 'native',
                            'phrase_language', 'learning',
                            'phrase_id', 'user');
        _opts['user'] = opts.user.id;
        _opts = _.assign(_opts, _.omit(_.pick(opts, 'user'), 'id'));
        if(_opts.user.auth) delete _opts.user['auth'];
        this.user = _opts.user;
        this._opts = _opts;
        _.extend(_opts, {native: opts.native.id, learning: opts.learning.id})
        return Post.create(_.extend(_opts, {traduction: trad.id}));
      })
      .then(function(post){
        post = _.isArray(post) ? post[0] : post;
        post['user'] = _.omit(this.user, 'createdAt', 'updatedAt', 'role', 'photo', 'activated');
        post['profile'] = _.pick(opts.profile, 'id');
        post['user']['image'] = _.pick(this._opts.image, 'photo80x80', 'secure_url');
        post['phrase'] = this.phrases;
        post['native'] = _.pick(opts.native, 'flag');
        post['learning'] = _.pick(opts.learning, 'flag');

        post['phrase_native'] = _.find(this.phrases, function(ph){
           return ph.traduction == post['traduction'] && opts.native.id == ph.language;
         });
        post['phrase_learning'] = _.find(this.phrases, function(ph){
          return ph.traduction == post['traduction'] && opts.learning.id == ph.language;
        });

        post.phrase_native['language'] = opts.native;
        post.phrase_learning['language'] = opts.learning;

        return post;
      })
      .catch(function(err){
        return err;
      });

    }

  }

};
