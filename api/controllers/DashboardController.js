/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird');

module.exports = {
	init: function (req, res, next){

		Promise.all([
				Profile.findOne({user: req.session.user.id}),
				Traduction.find({}).populateAll()]
			)
			.spread(function(profile, trads){
				req.session.profile = profile;
				return res.view('dashboard/init', { trads: trads, menu: 'dashboard' });
			})
			.catch(function(err){
				return res.negotiate(err);
			});

	}
};
