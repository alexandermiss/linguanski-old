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

  getFullProfile: async function ( opts ){

    console.log('OPTS', opts);


    var profile   = await Profile.findOne({user: opts.user});//.populate('user');
    console.log('PROFILE', profile);
    var setting   = await Setting.findOne({user: profile.user}).populate('language').populate('learning');
    console.log('SETTINGS', setting);
    // var language  = await Language.findOne({id: opts.language});
    var fichero   = await Fichero.getImageByUser(profile.user.id);
    // fichero = fichero.sort('createdAt DESC')[0];

    
    var data = {profile: profile};

    // data = _.clone(profile);
    data['setting'] = _.clone(setting);
    // data.setting.learning = _.clone(language);
    data['image'] = _.clone(fichero);
    return data;
  },

  // getBasicData: Promise.method(function(opts){

  //   return Promise.bind({}, Profile.find(opts).populateAll())
  //     .then(function(profiles){
  //       this.profiles = profiles;
  //       return Fichero.find({user: _.map(profiles, 'user.id')}).sort('createdAt DESC');
  //     })
  //     .then(function(ficheros){

  //       var profiles = _.map(this.profiles, function (profile){
  //         var obj = _.assign(
  //           _.pick(profile, 'id', 'info'),
  //           _.pick(profile.user, 'name', 'verified'));
  //         var img = _.first(_.filter(ficheros, {user:profile.user.id})) || {};
  //         obj['user_id'] = profile.user.id;
  //         obj['image'] = _.pick(img, 'photo80x80', 'secure_url');
  //         obj['friendship'] = 'maybe';
  //         return obj;
  //       });

  //       return profiles
  //     })
  //     .catch(function(err){
  //       sails.log.debug('Error al leer profile getBasicData\n', err);
  //       return err
  //     });

  // }),

  getBasicData: Promise.method(function(opts, extras){

    return Promise.bind({}, Profile.find(opts).populate('user'))
      .then(function(profiles){
        this.profiles = profiles;
        return Setting.find({user: _.map(this.profiles, 'user.id')}).populate('language').populate('learning');
      })
      .then(function(settings){

        var profiles = _.map(this.profiles, function (profile){
          var obj = _.assign(
            _.pick(profile, 'id', 'info', 'user'),
            _.pick(profile.user, 'name', 'verified'));
          obj['friendship'] = extras.status;

          var sett = _.find(settings, {user: profile.user.id}) || {};
          obj['language'] = _.pick( _.get(sett, 'language'), 'name', 'flag');
          obj['learning'] = _.pick( _.get(sett, 'learning'), 'name', 'flag');

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
        return Fichero.find({user: _.map(profiles, 'user.id')}).sort('createdAt DESC');
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
          //obj['image'] = _.pick(img, 'photo80x80', 'secure_url');

          var sett = _.find(settings, {user: profile.user.id}) || {};
          //sails.log.debug('sett', sett);
          obj['country'] = _.pick( _.get(sett, 'country'), 'name', 'flag');
          // obj['friend_id'] = ex._id;
          // obj['user_id'] = profile.user.id;
          // obj['me'] = ex.me;
          // obj['status'] = extras.status;
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
