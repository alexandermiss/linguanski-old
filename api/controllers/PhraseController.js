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
		Phrase.combineLanguages({}, function(err, phrases){
			if(err) return res.negotiate(err);
			res.json(phrases);
		});
	},

	addPhrase: function (req, res, next){
		if (req.isSocket) console.log('addPhraseSocket');
		else console.log('addPhraseAjax');

		var p = req.params.all();
		console.log(p);

		// res.json(p);
		Phrase.addPhrase(p, function(err, phrases){
			if(err) return res.negotiate(err);
			res.json(phrases);
		});
	},

};
