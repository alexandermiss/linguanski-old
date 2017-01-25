/**
 * AppController
 *
 * @description :: Server-side logic for managing apps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	traductions: function (req, res, next){
		Traduction.find({}).populate('phrase').exec(function (err, trads ){
			if (err) { return res.negotiate(err); }
			return res.view('traductions/init', { trads: trads });
		});
	},

	phrases: function (req, res, next){
		Phrase.find({}).populateAll().exec(function (err, trads ){
			if (err) { return res.negotiate(err); }
			return res.view('phrases/init', { trads: trads });
		});
	}

};

