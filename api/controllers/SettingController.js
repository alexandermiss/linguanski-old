/**
 * SettingController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	updateUser: function ( req, res, next ){
		var name = req.param('name');
		User.update({id: req.session.user.id}, {name: name}).exec(function(err, users){
			if(err){
				return res.json(err);
			}
			if(!users){
				return res.ok('No users found');
			}

			return res.json(users);
		});
	}

};
