/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/


  '/'                                 : 'HomeController.index',
  '/account/signin'                   : 'AppController.loginform',
  '/account/logout'                   : 'AppController.logout',
  '/account/signup'                   : 'AppController.registerform',
  '/account/info'                     : 'AppController.info',
  '/accounts/authorizations'          : 'AppController.authorizations',

  '/settings/first/configuration'     : 'SettingController.firstConfiguration',

  '/dashboard'                        : 'DashboardController.init',
  '/traductions'                      : 'AppController.traductions',
  '/phrases'                          : 'AppController.phrases',
  '/practise'                         : 'AppController.practise',

  'GET /exercise1'                    : 'Exercise.word',


  /***************************************************************************
  *                                                                          *
  * Api...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  // User update
  'POST /api/v1/user/settings'    : 'SettingController.updateUser',
  'GET /api/v1/accounts'          : 'ApiController.getUser',
  'PUT /api/v1/account/:id'       : 'ApiController.updateActivation',

  '/api/v1/phrases'               : 'PhraseController.getPhrases',
  'POST /api/v1/add_phrase'       : 'PhraseController.addPhrase',
  'PUT /api/v1/add_phrase/:id'    : 'PhraseController.updatePhrase',

};
