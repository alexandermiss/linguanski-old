/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	loginform: function ( req, res, next){
		return res.view('auth/signin', {layout:false});
	},

	registerform: function ( req, res, next){
		return res.view('auth/signup', {layout:false});
	},

	authorizations: function (req, res, next){
		return res.view('auth/authorizations_view');
	},

	traductions: function (req, res, next){
		Traduction.find({}).populate('phrase').exec(function (err, trads ){
			if (err) { return res.negotiate(err); }
			return res.view('traductions/init', { trads: trads });
		});
	},

	phrases: function (req, res, next){
		Language.find({}).exec(function (err, langs ){
			if (err) { return res.negotiate(err); }
			Source.find().exec(function(err, sources){
				if (err) { return res.negotiate(err); }
				return res.view('phrases/init', { langs: langs, sources: sources });
			});
		});
	},

	practise: function (req, res, next){
		return res.view('practise/index');
	},

	info: function (req, res, next){
		return res.json(req.session || {});
	},

	logout: function (req, res){
		waterlock.cycle.logout(req, res);
	}

};
