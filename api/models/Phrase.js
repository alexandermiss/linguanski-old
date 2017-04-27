/**
 * Phrase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var _ = require('lodash');

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
    if ( !_.has(opts, 'limit') ) opts.limit = 4;

    Phrase.find({language: opts.country_language_id},{ sort: 'createdAt DESC'}).paginate(_.pick(opts, 'page', 'limit')).exec(function(err, datas1){
      Phrase.find({ traduction: _.map(datas1, 'traduction'), language: opts.language_id },{ sort: 'createdAt DESC'}).exec(function(err, datas2){
        Phrase.find({ traduction: _.map(datas2, 'traduction') },{ sort: 'createdAt DESC'}).populateAll().exec(function(err, phrases){

        if (err) cb(err);
        var trads = _.groupBy(phrases, function (data){
  				return data.traduction.id;
  			});

  			var phrs = [];

  			Object.keys(trads).forEach(function(t){
  				var _ph = {};
  				_.each(trads[t], function(ph){
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
