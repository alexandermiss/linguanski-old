/**
 * Friend.js
 *
 * @description :: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    friend_one: {model: 'user'},
    friend_two: {model: 'user'},
    status: {type: 'string', isIn: ['me', 'pending', 'friend', 'canceled'], defaultsTo: 'pending'}
  },

  addFriend: function (opts, cb){
    var c = _.pick(opts, 'friend_one', 'friend_two');

      // Friend.create( c )
  		// 	.exec(function(err, friend){
  		// 		if(err) return cb(err);
  		// 		if(_.isArray(friend) && _.first(friend)) friend = friend[0];

      //     Profile.findOne({user: opts.user_id})
      //       .populate('user').exec(function(err, profile){
      //         if(err) return cb(err);

      //         Setting.findOne({user: profile.user.id}).populate('country').exec(function(err, settings){
      //           if(err) return cb(err);

      //           profile['setting'] = settings || {};

      //           // Extra
      //           profile['me'] = 'da';
      //           profile['status'] = 'pending';

      //           profile['friendship'] = 'friend';
      //           return cb(null, profile);
      //         });

      //     });
  		// 	});
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

  getFriends: function (opts){
    const Promise = require('bluebird');
    return new Promise(function(resolve, reject){

      let ds = Friend.getDatastore().manager;
      let db = ds.collection(Friend.tableName);
      var user_id = User._adapter.mongodb.ObjectId(opts.friend_one);
      var status = opts.status;
     
        db.aggregate([
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
          { $match: {friend: { $ne: user_id } } }
        ]).toArray(function (err, __friends){
          if(err) {
            return reject({err: err});
          }

          console.log('__friends__friends', __friends);

          var c = _.compact(__friends);
          c = _.map(c, 'friend');
          c = _.map(c, function(ci){
            return `${ci}`;
          });
  
          c = {user: c};

          return Profile.getBasicData(c, {status: status})
          .then(function(profiles){
            sails.log.debug('REQUESTSS\n', profiles);
            return resolve({results: profiles});
          })
          .catch(function(err){
            sails.log.debug('REQUESTSS\n', err);
            return reject(err);
          }); 

        });
    });
  },

  getRequests: function (opts, cb){
    const Promise = require('bluebird');

    return new Promise(function (resolve, reject){

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
  getMaybes: function (p){
    const Promise = require('bluebird');
    return new Promise(function (resolve, reject){
      try{
        var user_id = User._adapter.mongodb.ObjectId(p.friend_one);
        var ds = User.getDatastore().manager;
        var db = ds.collection(User.tableName);

        db.find({_id: {$ne: user_id}}).toArray(function(err, users){
          if(err) return reject(err);
          users = _.map(users, function(user){
            return _.extend(_.omit(user, 'password'), { id: user._id, friendship: 'maybe'});
          });
                    
          return resolve(users);
        });
      }catch(ex){
        console.log('EXX', ex);
        return reject(ex);
      }
    });
      
  }


};
