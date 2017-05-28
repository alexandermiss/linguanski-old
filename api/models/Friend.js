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

    Friend.find(_.pick(opts, 'friend_one'))
			.exec(function(err, friends){
				if(err) return cb(err);
        sails.log.debug(opts);
        var c = {};

        if(opts.friends)
          c = {user: _.map(friends, 'friend_two')};
        else
          c = {user: { '!': _.map(friends, 'friend_two')}};

				Profile.find(c)
					.populate('user').exec(function(err, profiles){
						if(err) return cb(err);

            var ids = _.map(profiles, 'user.id');
            sails.log.info('ids', ids);

            Setting.find({user: ids}).populate('country').exec(function(err, settings){
              if(err) return cb(err);

              profiles = _.map(profiles, function (profile){
                return _.extend(profile, {setting: _.find(settings, {user: profile.user.id})});
              });

              return cb(null, {results: profiles});
            });

				});

		});

  }

};
