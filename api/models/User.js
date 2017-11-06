/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.user.attributes({
    name: { type: 'string' },

    // defaultsTo: 'https://res.cloudinary.com/linguanski/image/upload/v1505708822/anon_user_suokqd.png'
    image: { model: 'fichero' },

    role: {type: 'string', enum: ['superadmin', 'admin', 'basic'], defaultsTo: 'basic'},
    suscription: {type: 'string', enum: ['premium', 'free'], defaultsTo: 'free'},
    activated: {type: 'boolean', defaultsTo: 0},
    verified: {type: 'boolean', defaultsTo: 0}
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
  }

};
