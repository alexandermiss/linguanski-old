/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	init: function (req, res, next){

		Profile.findOne({user: req.session.user.id}).exec(function(err, profile){
			if(err) return res.negotiate(err);

			req.session.profile = profile;

			Traduction.find({}).populateAll().exec(function (err, trads ){
				if (err) { return res.negotiate(err); }
				return res.view('dashboard/init', { trads: trads });
			});
		});
	}

};
