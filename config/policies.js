/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

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
    'registerform': true,
    'getAuthDatas': true
  },

  HomeController: {
    index: true,
  },

  SettingController: {
    'firstConfiguration': 'sessionAuth',
    'updateUser': 'checkToken'
  },

  PhraseController: {
    'getPhrases': 'checkToken',
    'addPhrase': 'checkToken',
    'updatePhrase': 'checkToken',
    'getOnePhrase': 'checkToken'
  },

  FriendController: {
    '*': ['sessionAuth', 'activatedUser'],
  },

  DashboardController: {
    '*': ['sessionAuth', 'activatedUser']
  },

  ApiController: {
    'getUser': 'checkToken',
    'updateActivation': 'checkToken',
    'getFriends': 'checkToken',
    'createFriend': 'checkToken',
    'updateFriend': 'checkToken',
    'getRequests': 'checkToken',
    'updateRequest': 'checkToken',
    'getInvitations': 'checkToken',
    'updateInvitation': 'checkToken',
    'getMaybe': 'checkToken',
    'updateMaybe': 'checkToken'
  },

  ProfileController: {
    'getProfile': 'sessionAuth',
    'updatePhoto': 'sessionAuth',
    'getFullProfile': 'checkToken'
  },

  PostController: {
    'addPost': 'checkToken',
    'listPost': 'checkToken'
  },

};
