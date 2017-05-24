/**
 * Profile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {model: 'user'},
    info: { type: 'string', defaultsTo: 'No info'}
  },

  getFullProfile: function (opts, cb){

    Profile.findOne({user: opts.friend_two})
      .populate('user')
      .exec(function(err, profile){
        if(err) return cb(err);
        return cb(null, {results: profile});
    });

  }
};
