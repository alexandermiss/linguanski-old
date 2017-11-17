/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  '*': false,

  AuthController: {
    '*': true
  },

  UserController: {
    '*': true
  },

  AppController: {
    'feed': 'sessionAuth',
    'traductions': 'sessionAuth',
    'phrases': 'sessionAuth',
    'practice': 'sessionAuth',
    'authorizations': 'sessionAuth',
    'loginform': true,
    'registerform': true
  },

  HomeController: {
    index: true,
  },

  SettingController: {
    'firstConfiguration': 'sessionAuth',
    'updateUser': 'hasJsonWebToken'
  },

  PhraseController: {
    // '*': ['sessionAuth', 'activatedUser'],
    'getPhrases': 'hasJsonWebToken',
    'addPhrase': 'hasJsonWebToken',
    'updatePhrase': 'hasJsonWebToken',
    'getJwtPhrases': 'hasJsonWebToken',
    getOnePhrase: 'hasJsonWebToken'
  },

  FriendController: {
    '*': ['sessionAuth', 'activatedUser'],
  },

  DashboardController: {
    '*': ['sessionAuth', 'activatedUser']
  },

  ApiController: {
    // '*': ['sessionAuth', 'activatedUser'],
    'getUser': 'hasJsonWebToken',
    'updateActivation': 'hasJsonWebToken',
    'getFriends': 'hasJsonWebToken',
    'createFriend': 'hasJsonWebToken',
    'updateFriend': 'hasJsonWebToken',
    'getRequests': 'hasJsonWebToken',
    'updateRequest': 'hasJsonWebToken',
    'getInvitations': 'hasJsonWebToken',
    'updateInvitation': 'hasJsonWebToken',
    'getMaybe': 'hasJsonWebToken',
    'updateMaybe': 'hasJsonWebToken',

    'getJwtFriends': 'hasJsonWebToken',
    'getJwtMaybe': 'hasJsonWebToken'
  },

  ProfileController: {
    'getProfile': 'sessionAuth',
    'updatePhoto': 'sessionAuth',
    'getFullProfile': 'hasJsonWebToken'
  },

  PostController: {
    // '*': ['sessionAuth', 'activatedUser'],
    'addPost': 'hasJsonWebToken',
    'listPost': 'hasJsonWebToken',
    'listApiPost': 'hasJsonWebToken'
  },

};
