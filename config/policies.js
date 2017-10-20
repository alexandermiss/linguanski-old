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
    '*': 'sessionAuth',
    'loginform': true,
    'registerform': true
  },

  HomeController: {
    index: true,
  },

  SettingController: {
    '*': 'sessionAuth'
  },

  PhraseController: {
    '*': ['sessionAuth', 'settingNecessary', 'activatedUser'],
    'getJwtPhrases': ['settingNecessary', 'hasJsonWebToken'],
    getOnePhrase: true
  },

  FriendController: {
    '*': ['sessionAuth', 'settingNecessary', 'activatedUser']
  },

  DashboardController: {
    '*': ['sessionAuth', 'settingNecessary', 'activatedUser']
  },

  ApiController: {
    '*': ['sessionAuth', 'settingNecessary', 'activatedUser'],
    'getJwtFriends': ['settingNecessary', 'hasJsonWebToken'],
    'getJwtMaybe': ['settingNecessary', 'hasJsonWebToken']
  },

  ProfileController: {
    '*': ['sessionAuth', 'settingNecessary', 'activatedUser'],
  }

};
