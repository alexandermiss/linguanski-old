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
      enum: ['t', 'p', 'c', 's'], // Text, Post, Comment, Share
    },
  	post_text: {type: 'string'},
  	post_html: {type: 'string'},

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

  listPost: function (opts, cb){
    opts.page = parseInt(opts.page);

    var skip = (opts.page - 1) * parseInt(opts.limit);

    Post.find({}).populate('native').populate('learning').skip(skip).limit(parseInt(opts.limit)).sort('createdAt DESC').exec(function(err, posts){

      if(err) {
        sails.log.verbose('ERR POSTSLISTS\n', err);
        return cb(err);
      }
      if (posts.length == 0){
        return cb(null, posts);
      }

      Profile.find({user: _.map(posts, 'user')}).then(function(profiles){
        this.profiles = profiles;
        return User.find({id: _.map(posts, 'user')}).populate('image');
      })
      .then(function(users){
        this.users    = users;
        return Phrase.find({traduction: _.map(posts, 'traduction')}).populate('language');
      })
      .then(function(phrases){
        var users     = this.users;
        var profiles  = this.profiles;

        posts = _.map(posts, function(post){
          post['user']    = _.pick(_.find(users, {id: post['user']}), 'name', 'image.secure_url', 'image.80x80');
          post['profile'] = _.pick(_.find(profiles, {user: post['user'].id}), 'id');
          post['phrase_native'] = _.find(phrases, function(ph){
             return ph.traduction == post['traduction'] && post.native.id == ph.language.id;
           });
          post['phrase_learning'] = _.find(phrases, function(ph){
            return ph.traduction == post['traduction'] && post.learning.id == ph.language.id;
          });
          return post;
        });
        return cb(null, posts);
      })
      .catch(function(err){
        sails.log.debug('LISTPOST ERR\n', err);
        cb(err);
      });

    });

  },

  addPost: function (opts){

    if(opts.post_type == 't'){
      var p = _.pick(opts,
        'post_type', 'post_text'
      );

      _.extend(p, {
        user: opts.user.id, native: opts.native.id,
        learning: opts.learning.id, traduction: null
      });

      return Post.create(p).then(function(post){
        post['user'] = _.omit(opts.user, 'createdAt', 'updatedAt', 'role', 'photo', 'activated');
        post['profile'] = _.pick(opts.profile, 'id');
        post['user']['image'] = _.pick(opts.image, 'photo80x80', 'secure_url');
        post['native'] = _.pick(opts.native, 'prefix', 'flag');
        post['learning'] = _.pick(opts.learning, 'prefix', 'flag');
        return post;
      })
      .catch(function(err){
        sails.log.verbose('POST TEXT\n', err);
        return err;
      });

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

  },

};
