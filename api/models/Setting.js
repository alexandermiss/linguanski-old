/**
 * Setting.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: { model: 'user' },
    language: { model: 'language' },  // Naive
    learning: { model: 'language' }, // Learning
    // learning: { collection: 'settinglanguage', via: 'setting'},
    country: { model: 'country' },
  },

  // byUser: async function (user_id){
  //   // let user = await User.findOne({id: opts.id});
  //   let setting = await Setting.findOrCreate({user: opts.id}, {user: opts.id, learning: opts.learning, language: opts.language});
  //   var data = {user, setting};
  //   console.log('DATADATA', data);
  //   return data;
  // }

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
