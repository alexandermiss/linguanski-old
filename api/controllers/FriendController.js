/**
 * FriendController
 *
 * @description :: Server-side logic for managing friends
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	list: function (req, res, next){
		return res.view('friends/friend_list', {menu: 'friends', secondary: 'friends'});
	},

	requests: function (req, res, next){
		return res.view('friends/request_list', {menu: 'friends', secondary: 'requests'});
	},

	invitations: function (req, res, next){
		return res.view('friends/invitations_list', {menu: 'invitations', secondary: 'invitations'});
	}

};
