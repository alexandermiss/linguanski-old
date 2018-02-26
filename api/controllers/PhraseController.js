/**
 * PhraseController
 *
 * @description :: Server-side logic for managing phrases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// var _ = require('lodash');

module.exports = {

	getPhrases: function (req, res, next){
		var sett = req.session.setting;

		if (req.isSocket){
			var native_room 	= 'phrase__' + sett.country.language.prefix + '_' + sett.language.prefix;
			var	language_room = 'phrase__' + sett.language.prefix + '_' + sett.country.language.prefix;
			sails.sockets.join(req, native_room);
			sails.sockets.join(req, language_room);
		}

		var p = req.allParams();
		Phrase.combineLanguages(_.extend(p, {country_language_id: sett.country.language.id, language_id: sett.language.id}), function(err, phrases){
			if(err) return res.negotiate(err);
			res.json(phrases);
		});
	},

	addPhrase: function (req, res, next){
		var p = req.allParams();
		var sett = req.session.setting;

		Phrase.addPhrase(_.extend(p, {
			country_language_id: sett.country.language.id, language_id: sett.language.id,
			phrase_native_flag_prefix: sett.country.language.prefix,
			phrase_language_flag_prefix: sett.language.prefix
		}), function(err, phrases){
			if(err) return res.negotiate(err);

			if (req.isSocket){
				var sent = {method: 'created', data: phrases};
				var sett = req.session.setting;
				var native_room 	= 'phrase__' + sett.country.language.prefix + '_' + sett.language.prefix;
				var	language_room = 'phrase__' + sett.language.prefix + '_' + sett.country.language.prefix;

				sails.sockets.broadcast([native_room, language_room], 'phrase', sent);
			}
			return res.created();
		});
	},

	updatePhrase: function (req, res, next){
		Language.findOne({prefix: req.param('lang')}).exec(function (err, lang){
			Phrase.update({traduction: req.param('id'), language: lang.id}, {phrase: req.param('phrase_'+lang.prefix)}).exec(function(err, phrase){
				if(err) return res.negotiate(err);
				return res.json(_.omit(req.allParams(), 'lang'));
			});
		});
	},

	getOnePhrase: function (req, res, next){
		var p = req.allParams();
		var sett = req.session.setting;

		Phrase.getOnePhrase(_.extend(p, {
			country_language_id: sett.country.language.id, language_id: sett.language.id,
			phrase_native_flag_prefix: sett.country.language.prefix,
			phrase_language_flag_prefix: sett.language.prefix
		}), function(err, data){
			return res.json(data);
		});
	}

};
