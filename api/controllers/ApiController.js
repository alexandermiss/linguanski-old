/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getUser: function (req, res, next){
		User.find().exec(function(err, users){
			res.json({results: users})
		});
	}

};
