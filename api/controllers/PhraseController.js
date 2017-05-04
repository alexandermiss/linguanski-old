/**
 * PhraseController
 *
 * @description :: Server-side logic for managing phrases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var _ = require('lodash');

module.exports = {

	getPhrases: function (req, res, next){

		if (!req.isSocket){ return res.badRequest();}

		sails.sockets.join(req, 'phrase');

		var p = req.params.all();
		Phrase.combineLanguages(_.extend(p, {country_language_id: req.session.setting.country.language.id, language_id: req.session.setting.language.id}), function(err, phrases){
			if(err) return res.negotiate(err);
			res.json(phrases);
		});
	},

	addPhrase: function (req, res, next){
		if (!req.isSocket){ return res.badRequest();}
		var p = req.params.all();

		Phrase.addPhrase(_.extend(p, {
			country_language_id: req.session.setting.country.language.id, language_id: req.session.setting.language.id,
			phrase_native_flag_prefix: req.session.setting.country.language.prefix,
			phrase_language_flag_prefix: req.session.setting.language.prefix
		}), function(err, phrases){
			if(err) return res.negotiate(err);
			sails.log.debug(phrases);
			var sent = {method: 'created', data: phrases};
			sails.sockets.broadcast('phrase', 'phrase', sent);
			return res.ok();
		});
	},

	updatePhrase: function (req, res, next){
		Language.findOne({prefix: req.param('lang')}).exec(function (err, lang){
			Phrase.update({traduction: req.param('id'), language: lang.id}, {phrase: req.param('phrase_'+lang.prefix)}).exec(function(err, phrase){
				if(err) return res.negotiate(err);
				return res.json(_.omit(req.params.all(), 'lang'));
			});
		});
	}

};
