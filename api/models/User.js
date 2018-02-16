/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

var _ = require('lodash');

module.exports = {

  attributes: require('waterlock').models.user.attributes({
    name: { type: 'string' },

    // defaultsTo: 'https://res.cloudinary.com/linguanski/image/upload/v1505708822/anon_user_suokqd.png'
    image: { model: 'fichero' },

    role: {type: 'string', isIn: ['superadmin', 'admin', 'basic'], defaultsTo: 'basic'},
    suscription: {type: 'string', isIn: ['premium', 'free'], defaultsTo: 'free'},
    activated: {type: 'boolean', defaultsTo: false},
    verified: {type: 'boolean', defaultsTo: false}
  }),

  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate,

  afterCreate: function (values, cb){
    Profile.create({ user: values.id }).exec(function (err, profile){
      if(err) return cb(err);

      Friend.create({ friend_one: values.id, friend_two: values.id, status: 'me' }).exec(function(err, friend){
        if(err) return cb(err);
        return cb(null, values);
      });
    });
  },

  generateSetting: function (opts, cb){

    User.update({id: opts.id}, {name: opts.name, image: '5a08d7582f1f745b1080f6bf' }).exec(function(err, _user){
      Setting.findOrCreate({user: opts.id, country: opts.country, language: opts.language}).exec(function (err, setting){
        if(err) return cb(err);
        if( _.isArray(setting) ) setting = setting[0];
        return cb(null, _user);
      })
    });

  }

};
