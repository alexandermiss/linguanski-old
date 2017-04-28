/**
 * Phrase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');
var ObjectId = require('mongodb').ObjectId;

module.exports = {
  schema: true,
  attributes: {
  	phrase: {type: 'string'},
  	pronuntiation: {type: 'string'},
  	comment_text: {type: 'string'},
  	language: {model: 'language'},
  	traduction:{model: 'traduction'}
  },
  combineLanguages: function (opts, cb){

    if ( !_.has(opts, 'page') ) opts.page = 1;
    if ( !_.has(opts, 'limit') ) opts.limit = 5;

    Phrase.native(function(err, _Phrase){
      _Phrase.aggregate([
        {$match: {$or: [{ language: Language.mongo.objectId(opts.country_language_id)},{ language: Language.mongo.objectId(opts.language_id)}]}},
        {$group: {_id: "$traduction", lenguaje: {$push: "$$ROOT"}, counter: {$sum: 1}}},
        {$match: {counter: {$gt: 1}}},
        {$sort: {_id: -1}}
      ]).skip((opts.page * opts.limit)).limit(opts.limit).toArray(function(err, __trads){
        if(err){
          sails.log.error(err);
          return cb(err);
        }
          Phrase.find({ traduction: _.map(__trads, '_id') },{ sort: 'createdAt DESC'}).populateAll().exec(function(err, phrases){
            if (err) cb(err);

            phrases = _.groupBy(phrases, function (data){
            	return data.traduction.id;
            });

            var phrs = [];

            Object.keys(phrases).forEach(function(t){
            	var _ph = {};
            	_.each(phrases[t], function(ph){
                var obj = {};
            		if ( ph.language.id == opts.country_language_id )
            			    obj = { phrase_native: ph.phrase, phrase_native_flag_prefix: ph.language.prefix };
            		else if ( ph.language.id == opts.language_id )
            			    obj = { phrase_language: ph.phrase, phrase_language_flag_prefix: ph.language.prefix };
                else
                  sails.log.debug('no phrase', ph);

                _.extend(_ph, obj, { phrase_id: ph.id }); // Get Phrase Id
            	});

              _.extend(_ph, { id: t }); // Get Traduction Id
            	phrs.push(_ph);
            });
            return cb(null, _.extend({ results: phrs }, _.pick(opts, 'page', 'limit')));

          });

      });
    });

  },
  addPhrase: function (opts, cb){
    Traduction.findOrCreate({comment_text: opts.comment_text || new Date().toJSON()}).exec(function(err, trad){
      if (err) return cb(err);
      if(_.isArray(trad)) trad = trad[0];

      var prefixes = ['ru', 'en', 'es'];

      Language.find({ prefix: prefixes }).exec(function (err, langs){
        if (err) return cb(err);

        var phrases = _.map(prefixes, function (pre){
          var _pre = ['phrase_'+pre], _ph = opts[ _pre ];
          return {
            phrase: _ph,
            pronuntiation: _ph,
            comment_text: _ph,
            language: _.find(langs, { prefix: pre }),
            traduction: trad.id
          }
        });

        Phrase.create(phrases).exec(function(err, phs){
          if (err){
            return cb(err);
          }
          _.extend(opts, {id: trad.id});
          return cb(null, _.omit(opts, 'comment_text'));
        });

      });

    });
  }
};
