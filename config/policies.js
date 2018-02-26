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
    'getPhrases': 'hasJsonWebToken',
    'addPhrase': 'hasJsonWebToken',
    'updatePhrase': 'hasJsonWebToken',
    'getOnePhrase': 'hasJsonWebToken'
  },

  FriendController: {
    '*': ['sessionAuth', 'activatedUser'],
  },

  DashboardController: {
    '*': ['sessionAuth', 'activatedUser']
  },

  ApiController: {
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
    'updateMaybe': 'hasJsonWebToken'
  },

  ProfileController: {
    'getProfile': 'sessionAuth',
    'updatePhoto': 'sessionAuth',
    'getFullProfile': 'hasJsonWebToken'
  },

  PostController: {
    'addPost': 'hasJsonWebToken',
    'listPost': 'hasJsonWebToken'
  },

};
