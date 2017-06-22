/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');

module.exports = {

	getUser: function (req, res, next){
		var p = req.params.all() || {};
		Profile.find(p).populate('user').exec(function(err, profiles){
			if(err) return res.json({err: err});
			return res.json({results: profiles})
		});
	},

	getFriends: function( req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id}, req.query);
		Friend.getFriends(p,
			function(err, friends){
				if(err) return res.json(err);

				// sails.log.info('profiles\n', friends);
				return res.json(friends);
		});
	},

	createFriend: function ( req, res, next ){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user.id});

		Friend.addFriend(p,
			function(err, friend){
				if(err) return res.json(err);
				if(!friend) {
					sails.log.error('friend', friend);
					return res.json({error: 'no friend created'});
				}
				sails.log.debug('friend\n',friend);
				return res.json(friend);
			});
	},

	updateFriend: function ( req, res, next ){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user.id});

		if( p.relationship == 'maybe' ){
			Friend.addFriend(p,
				function(err, friend){
					if(err) return res.json(err);
					if(!friend) {
						sails.log.debug('no friend\n');
						return res.json({error: 'no friend created'});
					}
					sails.log.debug('friend\n',friend);
					return res.json(friend);
				});
		}else{

			if( _.has(p, 'friendship') ){
				Friend.acceptFriend(p,
					function(err, friend){
						if(err) return res.json(err);
						if(!friend) {
							return res.json({error: 'no friend created'});
						}
						sails.log.debug('friend\n',friend);
						return res.json(friend);
					});
			}else{
				var c = _.pick(p, 'friend_one', 'friend_two');

				Friend.destroy( c ).exec(function(err){
	        if(err) return res.json(err);

	        var obj = _.omit(p, 'friend_one', 'friend_two');
	        obj['relationship'] = 'maybe';
	        sails.log.info('obj\n', obj);
	        return res.json(obj);
	      });
			}

		}

	},

	updateActivation: function (req, res, next){
		try {
			User.update({id: req.param('id')}, {activated: req.param('activated')}).exec(function(err, user){
				if(err) return res.notFound();
				if(_.isArray(user)) user = user[0];
				return res.json(user)
			});
		} catch (e) {
			return res.badRequest();
		}
	}

};
