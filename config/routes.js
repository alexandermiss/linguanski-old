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


  'GET /'                                 : 'HomeController.index',
  'GET /settings/first/configuration'     : 'SettingController.firstConfiguration',

  // Login
  'GET /account/signin'                   : 'AppController.loginform',
  'GET /account/logout'                   : 'AppController.logout',
  'GET /account/signup'                   : 'AppController.registerform',
  'GET /account/info'                     : 'AppController.info',

  'POST /auth/login'                      : 'AuthController.login',

  // Menu
  'GET /dashboard'                        : 'DashboardController.init',
  'GET /traductions'                      : 'AppController.traductions',
  'GET /phrases*'                         : 'AppController.phrases',
  'GET /practise'                         : 'AppController.practise',
  'GET /profile/:id'                      : 'ProfileController.getProfile',
  'GET /friends'                          : 'FriendController.list',
  'GET /requests'                         : 'FriendController.requests',
  'GET /invitations'                      : 'FriendController.invitations',

  // Admin
  'GET /admin/authorizations'             : 'AppController.authorizations',

  /***************************************************************************
  * Api...                                                                   *
  ***************************************************************************/

  // Profile
  'GET /api/v1/profile/getFullProfile'  : 'ProfileController.getFullProfile',
  'PUT /api/v1/profile/getFullProfile/:id'  : 'ProfileController.updatePhoto',

  // User update
  'POST /api/v1/user/settings'        : 'SettingController.updateUser',
  'GET /api/v1/accounts'              : 'ApiController.getUser',
  'PUT /api/v1/account/:id'           : 'ApiController.updateActivation',

  // Friends
  'GET /api/v1/friend'                : 'ApiController.getFriends',
  'POST /api/v1/friend'               : 'ApiController.createFriend',
  'PUT /api/v1/friend/:id'            : 'ApiController.updateFriend',

  // Requests
  'GET /api/v1/request'               : 'ApiController.getRequests',
  'PUT /api/v1/request/:id'           : 'ApiController.updateRequest',

  // Invitations
  'GET /api/v1/invitation'            : 'ApiController.getInvitations',
  'PUT /api/v1/invitation/:id'        : 'ApiController.updateInvitation',

  // Maybe
  'GET /api/v1/maybe'                 : 'ApiController.getMaybe',
  'PUT /api/v1/maybe/:id'             : 'ApiController.updateMaybe',

  // Phrases
  'GET /api/v1/phrases'               : 'PhraseController.getPhrases',
  'GET /api/v1/getOnePhrase'          : 'PhraseController.getOnePhrase',
  'POST /api/v1/add_phrase'           : 'PhraseController.addPhrase',
  'PUT /api/v1/add_phrase/:id'        : 'PhraseController.updatePhrase',

  // API v1.1
  'GET /api/v1.1/phrases'             : 'PhraseController.getJwtPhrases',
  'GET /api/v1.1/friend'              : 'ApiController.getJwtFriends',
  'GET /api/v1.1/maybe'               : 'ApiController.getJwtMaybe',
};
