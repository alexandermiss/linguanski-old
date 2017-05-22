/**
 * SettingController
 *
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {

	updateUser: function ( req, res, next ){
		var name = req.param('name')
		, country = req.param('country')
		, prefix = req.param('language');

		Language.findOne({prefix: prefix}).exec(function (err, language){
			if(err) return res.json(err);
			if(!language) return res.json({error: 'No language found'});
			Country.findOne({prefix: country}).exec(function (err, country){
				if(err) return res.json(err);
				if(!country) return res.json({error: 'No country found'});

				User.update({id: req.session.user.id}, {name: name}).exec(function(err, users){
					if(err){
						return res.json(err);
					}
					if(!users){
						return res.ok('No users found');
					}
					Setting.findOrCreate({user: req.session.user.id},
						{	user: req.session.user.id,
							country: country.id,
							language: language.id
						}).exec(function (err, setting){
							if(err) return res.json(err);

							SettingLanguage.findOrCreate({setting: setting.id, language: language.id},
								{setting: setting.id, language: language.id, active: 1}).exec(function(settingLang){
								Setting.findOne(setting.id).populate('country').populate('language').exec(function(err, setting){
									if(_.has(setting, 'user'))
										req.session['setting'] = _.pick(setting, 'id', 'country', 'language');
										req.session.user.name = name;
										return res.json({setting: setting});
								});
							});
						});
				}); // User
			}); // Country
		}); // Language
	},

	firstConfiguration: function ( req, res, next ){
		res.view('settings/data_person', {layout: false});
	},



};
