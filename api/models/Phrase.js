/**
 * Phrase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
    Phrase.find(opts).populateAll().exec(function(err, datas){
      if (err) cb(err);
      var trads = _.groupBy(datas, function (data){
				return data.traduction.id;
			});

			var phrs = [];

			Object.keys(trads).forEach(function(t){
				var _ph = {};
				_.each(trads[t], function(ph){
          var obj = {};
					if ( ph.language.prefix == 'es' )
						    obj = { phrase_es: ph.phrase };
					else if ( ph.language.prefix == 'ru' )
						    obj = { phrase_ru: ph.phrase };
					else
						    obj = { phrase_en: ph.phrase };

          _.extend(_ph, obj, { phrase_id: ph.id }); // Get Phrase Id
				});

        _.extend(_ph, { id: t }); // Get Traduction Id
				phrs.push(_ph);
			});
      return cb(null, phrs);
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
