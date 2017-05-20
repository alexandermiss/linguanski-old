/**
 * Auth
 *
 * @module      :: Model
 * @description :: Holds all authentication methods for a User
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: require('waterlock').models.auth.attributes({

    /* e.g.
    nickname: 'string'
    */

  }),

  // beforeCreate: require('waterlock').models.auth.beforeCreate,
  // beforeUpdate: require('waterlock').models.auth.beforeUpdate

  beforeCreate: function (values, cb){
    sails.log.info('values.v', values);
    return require('waterlock').models.auth.beforeCreate(values, cb)
  }
};
