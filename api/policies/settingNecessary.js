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

  if (req.session.setting && req.session.setting.country) return next();

  Setting.findOne({user: req.session.user.id})
    .populate('country').populate('language').exec(function( err, setting ){
    if ( err ) return res.negotiate(err);
    if ( !setting ) return res.redirect('/settings/first/configuration');

    Country.findOne({id: setting.country.id})
      .populate('language').exec(function (err, country){
        if ( err || !country ) return res.negotiate(err);
        setting.country = country;
        req.session['setting'] = setting;
        return next();

      })
    ;
    })
  ;
};
