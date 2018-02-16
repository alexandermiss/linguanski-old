/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /'                                 : 'HomeController.index',
  'GET /settings/first/configuration'     : 'SettingController.firstConfiguration',

  // Login
  'GET /account/signin'                   : 'AppController.loginform',
  'GET /account/logout'                   : 'AuthController.logout',
  'GET /account/signup'                   : 'AppController.registerform',
  'GET /account/info'                     : 'AppController.info',

  'POST /auth/login'                      : 'AuthController.login',
  'POST /auth/register'                   : 'AuthController.register',

  // Menu
  'GET /dashboard'                        : 'DashboardController.init',
  'GET /feed*'                            : 'AppController.feed',
  'GET /traductions'                      : 'AppController.traductions',
  'GET /phrases*'                         : 'AppController.phrases',
  'GET /practice'                         : 'AppController.practice',
  'GET /profile/:id'                      : 'ProfileController.getProfile',
  'GET /friends'                          : 'FriendController.list',
  'GET /requests'                         : 'FriendController.requests',
  'GET /invitations'                      : 'FriendController.invitations',

  // Admin
  'GET /admin/authorizations'             : 'AppController.authorizations',



  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

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

  // Post
  'GET /api/v1/post'                  : 'PostController.listPost',
  'POST /api/v1/post'                 : 'PostController.addPost',

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝

};
