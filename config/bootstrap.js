/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function(done) {

  /*var _f = function(j){ const seedPath = sails.config.appPath + '/seeds/'; return require(seedPath + j + '.json'); }

  const IMAGEN =      _f('fichero')
  const LANGUAGES =   _f('languages')
  const USERS =       _f('users')

  await Fichero.create(IMAGEN);
  await Language.createEach(LANGUAGES);*/
  // await User.createEach(USERS);
  
  return done();

};
