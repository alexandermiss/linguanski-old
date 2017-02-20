/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = require('waterlock').actions.user({

  _config: {
    actions: true,
    rest: true,
    shortcuts: true
  },

  /* e.g.
    action: function(req, res){

    }
  */
});
