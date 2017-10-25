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

  })
};
