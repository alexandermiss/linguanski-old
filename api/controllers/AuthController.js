/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: Provides the base authentication
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').waterlocked({
    _config:{
      actions: true,
      rest: true,
      shortcuts: true
    },
    loginform: function ( req, res, next){
  		return res.view('auth/signin', {layout:false});
    }
});
