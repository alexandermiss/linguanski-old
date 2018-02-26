/**
 * Friend.js
 *
 * @description :: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

module.exports = {
  schema: true,
  attributes: {
    friend_one: {model: 'user'},
    friend_two: {model: 'user'},
    status: {type: 'string', isIn: ['pending', 'friend', 'canceled', 'me'], defaultsTo: 'pending'}
  },

  addFriend: function (opts, cb){
    sails.log.verbose('opts\n', opts);
    var c = _.pick(opts, 'friend_one', 'friend_two');

      Friend.create( c )
  			.exec(function(err, friend){
  				if(err) return cb(err);
  				if(_.isArray(friend) && _.first(friend)) friend = friend[0];

          Profile.findOne({user: opts.user_id})
            .populate('user').exec(function(err, profile){
              if(err) return cb(err);

              Setting.findOne({user: profile.user.id}).populate('country').exec(function(err, settings){
                if(err) return cb(err);

                profile['setting'] = settings || {};

                // Extra
                profile['me'] = 'da';
                profile['status'] = 'pending';

                profile['friendship'] = 'friend';
                return cb(null, profile);
              });

          });
  			});
  },

  confirmFriend: function (opts, cb){
    sails.log.verbose('opts\n', opts);

    Friend.update({or: [
      {friend_one: opts.friend_one, friend_two: opts.friend_two},
      {friend_one: opts.friend_two, friend_two: opts.friend_one}
    ], status: 'pending'}, {status: 'friend'}).exec(function (err, data){
      if(err) return cb(err);
      Profile.findOne(opts.id)
        .populate('user').exec(function(err, profile){
          if(err) return cb(err);

          Setting.findOne({user: profile.user.id}).populate('country').exec(function(err, setting){
            if(err) return cb(err);

            profile['setting'] = setting || {};
            profile['friendship'] = 'friend';
            return cb(null, profile);
          });

      });

    });
  },

  getFriends: function (opts, cb){
    var user_id = User._adapter.mongodb.ObjectId(opts.friend_one);
    var status = opts.status;
    sails.log.debug('STATUS', status);
    Friend.native(function(err, _Friend){

      var friends = _Friend.aggregate([
        { $match: {status: { $eq: status}} },
        {
          $project: {
            _id: 1,
            status: "$status",
            me: {
              $cond: {if: {$eq: ["$friend_one", user_id] }, then: "da", else: "net" }
            },
            friend: {
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
                default: null
              }
            }
          }
        },
        { $match: {friend: { $ne: null } } }
      ]).toArray(function (err, __friends){
        var c = _.compact(__friends);
        c = _.map(c, 'friend');
        c = _.map(c, _.toString);

        c = {user: c};

        Profile.getIntermediateData(c, {
          __friends: __friends, status: status})
        .then(function(profiles){
          sails.log.debug('FRIENDSS\n', profiles);
          return cb(null, {results: profiles});
        })
        .catch(function(err){
          sails.log.debug('FRIENDS\n', profiles);
          return err;
        });

      });
    });
  },

  getRequests: function (opts, cb){
    var user_id = User._adapter.mongodb.ObjectId(opts.friend_one);
    var status = opts.status;

    Friend.native(function(err, _Friend){

      var friends = _Friend.aggregate([
        { $match: {status: { $eq: status}} },
        {
          $project: {
            _id: 1,
            status: "$status",
            me: {
              $cond: {if: {$eq: ["$friend_one", user_id] }, then: "da", else: "net" }
            },
            friend: {
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
                default: null
              }
            }
          }
        },
        { $match: {friend: { $ne: null } } },
        { $match: {me: {$eq: "da"} } }
      ]).toArray(function (err, __friends){
        var c = _.compact(__friends);
        c = _.map(c, 'friend');
        c = _.map(c, _.toString);

        c = {user: c};

        Profile.getIntermediateData(c, {
          __friends: __friends, status: status})
        .then(function(profiles){
          sails.log.debug('REQUESTSS\n', profiles);
          return cb(null, {results: profiles});
        })
        .catch(function(err){
          sails.log.debug('REQUESTSS\n', profiles);
          return err;
        });

      });
    });
  },


  getInvitations: function (opts, cb){
    var user_id = User._adapter.mongodb.ObjectId(opts.friend_one);
    var status = opts.status;
    sails.log.debug('INVITATIONS');
    // sails.log.debug('STATUS', status);
    Friend.native(function(err, _Friend){

      var friends = _Friend.aggregate([
        { $match: {status: { $eq: status}} },
        {
          $project: {
            _id: 1,
            status: "$status",
            me: {
              $cond: {if: {$eq: ["$friend_one", user_id] }, then: "da", else: "net" }
            },
            friend: {
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
                default: null
              }
            }
          }
        },
        { $match: {friend: { $ne: null } }},
        { $match: {me: {$eq: "net"} } }
      ]).toArray(function (err, __friends){
        var c = _.compact(__friends);
        c = _.map(c, 'friend');
        c = _.map(c, _.toString);

        c = {user: c};

        Profile.getIntermediateData(c, {
          __friends: __friends, status: status})
        .then(function(profiles){
          sails.log.debug('INVITATIONSS\n', profiles);
          return cb(null, {results: profiles});
        })
        .catch(function(err){
          sails.log.debug('INVITATIONSS\n', profiles);
          return err;
        });


      });

    });
  },
  // Get maybes
  getMaybes: function (opts, cb){
    var user_id = User._adapter.mongodb.ObjectId(opts.friend_one);
    Friend.native(function(err, _Friend){
      var friends = _Friend.aggregate([
        { $match: { status: { $nin: ['me', 'canceled'] } }},
        {
          $project: {
            _id: 1,
            status: "$status",
            friend: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ["$friend_one", user_id] },
                    then: "$friend_two"
                  },
                  {
                    case: { $eq: ["$friend_two", user_id] },
                    then: "$friend_one"
                  }
                ],
                default: null
              }
            }
          }
        },
        { $match: {friend: { $ne: null }} }
      ]).toArray(function (err, __friends){
        var c = _.compact(__friends);
        c = _.map(c, 'friend');
        c = _.map(c, _.toString);

        c.push(opts.friend_one)
        c = {user: { '!': c }};

        Profile.getBasicData(c).then(function(profiles){
          sails.log.debug('PROFILES MAYBE\n', profiles);
          return cb(null, {results: profiles});
        }).catch(function(err){
          sails.log.debug('Profile.getBasicDat', err);
          return err;
        });

      });
    });

  }


};
