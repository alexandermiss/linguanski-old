/**
 * Setting.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    country: { model: 'country' },    // Native
    language: { model: 'language' },  // Learning
    user: { model: 'user' },
    learning: { collection: 'settinglanguage', via: 'setting'}
  },

  // getConfigLangs: function (opts, cb){
  //
  //   Setting.findOne(opts)
  //     .populate('country').populate('language').exec(function( err, setting ){
  //     if ( err ) return cb(err);
  //     if ( !setting ) return cb(null);
  //
  //     Country.findOne({id: setting.country.id})
  //       .populate('language').exec(function (err, country){
  //         if ( err || !country ) return cb(err);
  //         setting.country = country;
  //         req.session['setting'] = setting;
  //         return next();
  //
  //     });
  //   });
  // }
};
