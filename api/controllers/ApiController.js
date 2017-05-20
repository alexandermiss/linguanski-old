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
		User.find(p).populate('auth').exec(function(err, users){
			res.json({results: users})
		});
	},

	updateActivation: function (req, res, next){
		try {
			console.log(req.params.all());
			User.update({id: req.param('id')}, {activated: req.param('activated')}).exec(function(err, user){
				if(err) return res.notFound();
				console.log('user', user);
				if(_.isArray(user)) user = user[0];
				return res.json(user)
			});
		} catch (e) {
			return res.badRequest();
		}

	}

};
