/**
 * Friend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

module.exports = {
  schema: true,
  attributes: {
    friend_one: {model: 'user'},
    friend_two: {model: 'user'},
    status: {enum: ['pending', 'friend', 'me'], defaultsTo: 'pending'}
  },

  addFriend: function (opts, cb){
    sails.log.verbose('opts\n', opts);

    Friend.create(opts)
			.exec(function(err, friend){
				if(err) return cb(err);
				if(_.isArray(friend) && _.first(friend)) friend = friend[0];

        Profile.findOne({user: opts.user.id})
          .populate('user').exec(function(err, profile){
            if(err) return cb(err);

            Setting.findOne({user: profile.user.id}).populate('country').exec(function(err, settings){
              if(err) return cb(err);

              profile['setting'] = settings || {};
              profile['relationship'] = 'friend';
              return cb(null, profile);
            });

        });
			});
  },

  acceptFriend: function (opts, cb){
    sails.log.verbose('opts\n', opts);

    Friend.update({or: [
      {friend_one: opts.friend_one, friend_two: opts.friend_two},
      {friend_one: opts.friend_two, friend_two: opts.friend_one}
    ]}, {status: 'friend'}).exec(function (err, data){
      sails.log.verbose('data\n', data);
      if(err) return cb(err);
      Profile.findOne(opts.id)
        .populate('user').exec(function(err, profile){
          if(err) return cb(err);

          Setting.findOne({user: profile.user.id}).populate('country').exec(function(err, settings){
            if(err) return cb(err);

            profile['setting'] = settings || {};
            profile['relationship'] = 'friend';
            return cb(null, profile);
          });

      });

    });
  },

  getFriends: function (opts, cb){
    var user_id = User.mongo.objectId(opts.friend_one);

    Friend.native(function(err, _Friend){

      var friends = _Friend.aggregate([
        { $match: {status: { $ne: 'me'}} },
        {
          $project: {
            _id: 1,
            estatus: "$status",
            friendship: {
              $cond: { if: {$eq: ["$friend_one", user_id]}, then: 1, else: 0 }
            },
            relationship: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$friend_one", user_id] },
                    then: "$friend_two"
                  },
                  {
                    case: { $eq: ["$friend_two", user_id]},
                    then: "$friend_one"
                  }
                ],
                default: "Not found"
              }
            }
          }
        },
        // { $match: {relationship: { $ne: "$friend_one"}} }
      ]).toArray(function (err, __friends){
        if(_.has(opts, 'friends'))
          sails.log.verbose('__friends\n',__friends);

        sails.log.verbose('opts\n',opts);

        var c = _.map(__friends, 'relationship');
        sails.log.verbose('map\n',c);

        if(_.has(opts, 'friends'))
          c = {user: c};
        else{
          // Self user for exclude from list
          c.push(opts.friend_one)
          c = {user: { '!': c }};
        }

    		Profile.find(c)
    			.populate('user').exec(function(err, profiles){
    				if(err) return cb(err);
            var ids = _.map(profiles, 'user.id');

            Setting.find({user: ids}).populate('country').exec(function(err, settings){
              if(err) return cb(err);

              profiles = _.map(profiles, function (profile){
                profile['setting'] = _.find(settings, {user: profile.user.id}) || {};
                if(_.has(opts, 'maybe')) profile['relationship'] = 'maybe';
                if( _.has(opts, 'friends') ){
                  sails.log.debug(_.find(__friends, {relationship: User.mongo.objectId(profile.user.id)}));
                  profile['friendship'] = _.find(__friends, {relationship: User.mongo.objectId(profile.user.id)}).friendship;
                }
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
