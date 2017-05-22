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
    photo: { type: 'string' },
    role: {type: 'string', enum: ['superadmin', 'admin', 'basic'], defaultsTo: 'basic'},
    activated: {type: 'boolean', defaultsTo: 0}
  }),

  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate,

  afterCreate: function (values, cb){
    Profile.create({ user: values.id }).exec(function (err, profile){
      if(err) return cb(err);
      return cb();
    });
  }

};
