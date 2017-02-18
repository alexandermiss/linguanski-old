/**
 * PhraseController
 *
 * @description :: Server-side logic for managing phrases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	getPhrases: function (req, res, next){
		if (req.isSocket) console.log('getPhrasesSocket');
		else console.log('getPhrasesAjax');
		var p = req.params.all();
		sails.log.info(p);
		Phrase.combineLanguages(p, function(err, phrases){
			if(err) return res.negotiate(err);
			res.json(phrases);
		});
	},

	addPhrase: function (req, res, next){
		if (req.isSocket) console.log('addPhraseSocket');
		else console.log('addPhraseAjax');

		var p = req.params.all();
		sails.log.info(p);

		Phrase.addPhrase(p, function(err, phrases){
			if(err) return res.negotiate(err);
			res.json(phrases);
		});
	},

};
