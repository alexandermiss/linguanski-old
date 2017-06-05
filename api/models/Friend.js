/**
 * Friend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

module.exports = {

  attributes: {
    friend_one: {model: 'user'},
    friend_two: {model: 'user'},
    status: {enum: ['pending', 'friend', 'me'], defaultsTo: 'pending'}
  },

  addFriend: function (opts, cb){
    Friend.create(opts)
			.exec(function(err, friend){
				if(err) return cb(err);
				if(_.isArray(friend) && _.first(friend)) friend = friend[0];

				Profile.getFullProfile({user: friend.friend_two},
					function(err, profile){
						if(err) return cb(err);
						return cb(null, {results: profile});
				});
			});
  },

  getFriends: function (opts, cb){
    var user_id = opts.friend_one;

    Friend.native(function(err, _Friend){

      var friends = _Friend.aggregate([
        {
          $match: {status: { $ne: 'me'}}
        },
        {
          $project:
          {
            _id: 1,
            estatus: "$status",
            relationship:
              {
                $switch:
              {
              branches: [
                {
                  case: { $eq: ["$friend_one", User.mongo.objectId(user_id)] },
                  then: "$friend_two"
                },
                {
                  case: { $eq: ["$friend_two", User.mongo.objectId(user_id)]},
                  then: "$friend_one"
                }
              ],
              default: "Not found"
              }
            }
          }
        }
      ]).toArray(function (err, __friends){
        sails.log.debug('opts\n',opts);

        var c = _.map(__friends, 'relationship');
        if(_.has(opts, 'friends'))
          c = {user: c};
        else
          c = {user: { '!': c}};

    		Profile.find(c)
    			.populate('user').exec(function(err, profiles){
    				if(err) return cb(err);
            var ids = _.map(profiles, 'user.id');

            Setting.find({user: ids}).populate('country').exec(function(err, settings){
              if(err) return cb(err);

              profiles = _.map(profiles, function (profile){
                profile['setting'] = _.find(settings, {user: profile.user.id}) || {};
                return profile;
              });

              if(_.has(opts, 'friends')){
                profiles = _.map(profiles, function (profile){
                  var obj = _.find(__friends, {relationship: User.mongo.objectId(profile.user.id)}) || {};
                  if( _.has(obj, 'estatus') )
                    profile['relationship'] = obj.estatus;
                  return profile;
                });
              }

              return cb(null, {results: profiles});
            });

    		});

      });

    });
  }

};
