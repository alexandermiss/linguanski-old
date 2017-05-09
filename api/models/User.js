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
    role: {type: 'string', enum: ['superadmin', 'admin', 'basic'], defaultsTo: 'basic'},
    validated: {type: 'boolean', defaultsTo: 0}
  }),

  beforeCreate: require('waterlock').models.user.beforeCreate,
  beforeUpdate: require('waterlock').models.user.beforeUpdate
};
