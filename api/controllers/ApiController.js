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
		_.extend(p, {friend_one: req.session.user.id, status: 'friend'}, req.query);
		Friend.getFriends(p,
			function(err, friends){
				sails.log.info('friends\n', friends);
				if(err) return res.json(err);
				return res.json(friends);
		});
	},

	getRequests: function( req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, status: 'pending'}, req.query);
		Friend.getRequests(p,
			function(err, requests){
				sails.log.info('requests\n', requests);
				if(err) return res.json(err);
				return res.json(requests);
		});
	},

	getInvitations: function( req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, status: 'pending'}, req.query);
		Friend.getInvitations(p,
			function(err, invitations){
				sails.log.info('Invitations\n', invitations);
				if(err) return res.json(err);
				return res.json(invitations);
		});
	},

	createFriend: function ( req, res, next ){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user_id});

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
		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user_id});

		if( p.status == 'friend' ){
			var c = _.pick(p, 'friend_one', 'friend_two');

			var or = {
	              or: [
								    {friend_one: c.friend_one, friend_two: c.friend_two},
				            {friend_one: c.friend_two, friend_two: c.friend_one},
								], status: 'friend'
      };

			Friend.update( or, {status: 'canceled'} ).exec(function(err){
          if(err) return res.json(err);

          var obj = _.omit(p, 'friend_one', 'friend_two');
          obj['status'] = 'maybe';
          sails.log.info('obj\n', obj);
          return res.json(obj);
      });
		}else{
			Friend.addFriend(p,	function(err, friend){
				if(err) return res.json(err);
				if(!friend) {
					sails.log.error('friend', friend);
					return res.json({error: 'no friend created'});
				}
				delete friend['friendship'];
				friend['status'] = 'confirm'
				sails.log.debug('friend\n',friend);
				return res.json(friend);
			});

		}
	},

	getMaybe: function (req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id}, req.query);
		Friend.getMaybes(p,
			function(err, maybes){
				if(err) return res.json(err);
				return res.json(maybes);
		});
	},

	updateMaybe: function (req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user_id});

		if(p.friendship == 'maybe'){

			// Add friend
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
			var c = _.pick(p, 'friend_one', 'friend_two');
			_.extend(c, {status: 'pending'});

			// Cancel maybe
			Friend.update(c, {status: 'canceled'}).exec(function(err){
				if(err) return res.json(err);

				var obj = _.omit(p, 'friend_one', 'friend_two');
				obj['friendship'] = 'maybe';
				sails.log.info('obj\n', obj);
				return res.json(obj);
			});
		}
	},

	updateRequest: function (req, res, next){
		var p = req.params.all();

		sails.log.debug('updateRequest');
		sails.log.debug('STATUS ', p.status);
		sails.log.debug('OBJ ', p);

		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user_id});

		if( p.status == 'pending' ){
			var c = _.pick(p, 'friend_one', 'friend_two');

			Friend.update({id: p.friend_id}, {status: 'canceled'}).exec(function(err, updated){
				if(err) return res.json(err);

				var obj = _.omit(p, 'friend_one', 'friend_two');
				obj['status'] = 'maybe';
				sails.log.info('request obj\n', obj);
				return res.json(obj);
			});
		}else{

			// status:
			Friend.addFriend(p,
				function(err, friend){
					if(err) return res.json(err);
					if(!friend) {
						sails.log.debug('no friend\n');
						return res.json({error: 'no friend created'});
					}
					delete friend['friendship'];
					friend['status'] = 'pending';
					sails.log.debug('friend\n',friend);
					return res.json(friend);
			});
		}
	},

	// Update Invitation
	updateInvitation: function (req, res, next){
		var p = req.params.all();

		sails.log.debug('updateInvitation');
		sails.log.debug('method', req.method);
		sails.log.debug('STATUS ', p.status);
		sails.log.debug('OBJ ', p);

		_.extend(p, {friend_one: req.session.user.id, friend_two: p.user_id});

		if( p._action == 'confirm' ){
			var c = _.pick(p, 'friend_one', 'friend_two');

			// Action: confirm
			Friend.update({id: p.friend_id}, {status: 'friend'}).exec(function(err, updated){
				if(err) return res.json(err);
				return res.json({status: 'friend'});
			});
		}else{

			// Action: canceled
			Friend.update({id: p.friend_id}, {status: 'canceled'}).exec(function(err, updated){
				if(err) return res.json(err);
				return res.json({status: 'canceled'});
			});
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
	},

	getJwtFriends: function( req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id, status: 'friend'}, req.query);
		Friend.getFriends(p,
			function(err, friends){
				sails.log.info('friends\n', friends);
				if(err) return res.json(err);
				return res.json(friends);
		});
	},

	getJwtMaybe: function (req, res, next){
		var p = req.params.all();
		_.extend(p, {friend_one: req.session.user.id}, req.query);
		Friend.getMaybes(p,
			function(err, maybes){
				if(err) return res.json(err);
				return res.json(maybes);
		});
	},
};
