/**
 * settingNecessary
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {

  Setting.findOne({user: req.session.user.id}).exec(function( err, setting ){
    if ( err ) return res.serverError(err);
    if ( !setting ) return res.redirect('/settings/first/configuration');

    req.session['setting'] = setting;
    return next();

  });

};
