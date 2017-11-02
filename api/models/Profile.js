/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = {

  attributes: {
    user: {model: 'user'},
    info: { type: 'string', defaultsTo: 'No info'}
  },

  getFullProfile: Promise.method(function (opts){

    return Promise.bind({}, Profile.findOne(opts).populateAll())
      .then(function(profile){
        this.profile = profile;
        return Setting.findOne({user: profile.user.id}).populateAll();
      })
      .then(function(setting){
        this.setting = setting;
        return Language.findOne(setting.country.language);
      })
      .then(function(language){
        this.language = language;
        return Fichero.find({user:this.profile.user.id}).sort('createdAt DESC');
      })
      .then(function(fichero){
        fichero = _.isArray(fichero) ? fichero[0] : fichero;
        this.profile['setting']               = this.setting;
        this.profile.setting.country.language = this.language;
        this.profile.image = fichero;
        return this.profile;
      })
      .catch(function(e){
        return e;
      });

  }),

  getBasicData: Promise.method(function(opts){

    return Promise.bind({}, Profile.find(opts).populateAll())
      .then(function(profiles){
        this.profiles = profiles;
        return Fichero.find({user: _.map(profiles, 'user.id')})
      })
      .then(function(ficheros){

        var profiles = _.map(this.profiles, function (profile){
          var obj = _.assign(
            _.pick(profile, 'id', 'info'),
            _.pick(profile.user, 'name', 'verified'));
          var img = _.first(_.filter(ficheros, {user:profile.user.id})) || {};
          obj['user_id'] = profile.user.id;
          obj['image'] = _.pick(img, 'photo80x80', 'secure_url');
          obj['friendship'] = 'maybe';
          return obj;
        });

        return profiles
      })
      .catch(function(err){
        sails.log.debug('Error al leer profile getBasicData\n', err);
        return err
      });

  }),

  getIntermediateData: Promise.method(function(opts, extras){

    return Promise.bind({}, Profile.find(opts).populateAll())
      .then(function(profiles){
        this.profiles = profiles;
        return Fichero.find({user: _.map(profiles, 'user.id')});
      })
      .then(function(ficheros){
        this.ficheros = ficheros;
        return Setting.find({user: _.map(this.profiles, 'user.id')}).populate('country');
      })
      .then(function(settings){
        var profiles = this.profiles;
        var ficheros = this.ficheros;

        profiles = _.map(profiles, function (profile){
          var ex = _.find(extras.__friends, {friend:User.mongo.objectId(profile.user.id)}) || {};

          var obj = _.assign(
            _.pick(profile, 'id', 'info'),
            _.pick(profile.user, 'id', 'name', 'verified'));
          var img = _.first(_.filter(ficheros, {user:profile.user.id})) || {};
          obj['image'] = _.pick(img, 'photo80x80', 'secure_url');

          var sett = _.find(settings, {user: profile.user.id}) || {};
          sails.log.debug('sett', sett);
          obj['country'] = _.pick( _.get(sett, 'country'), 'name', 'flag');
          obj['friend_id'] = ex._id;
          obj['user_id'] = profile.user.id;
          obj['me'] = ex.me;
          obj['status'] = extras.status;
          return obj;
        });

        return profiles
      })
      .catch(function(err){
        sails.log.debug('Error al leer profile getIntermediateData\n', err);
        return err
      });

  })
};
