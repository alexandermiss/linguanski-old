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
  	source: {model: 'source'},
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
						    obj = { phrase_mx: ph.phrase };
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
    Traduction.findOrCreate({comment_text: 'jajajaja'}).exec(function(err, trad){
      if (err) return cb(err);
      if(_.isArray(trad)) trad = trad[0];

      console.log(trad);

      var phrases = _.map(['ru', 'en', 'mx'], function (pre){
        var _pre = ['phrase_'+pre], _ph = opts[ _pre ];
        return {
          phrase: _ph,
          pronuntiation: _ph,
          comment_text: _ph
        }
      });

      // Phrase.create(
      //
      // ).exec(function(err, phs){
      //   if (err){
      //     console.log(err);
      //     return cb(err);
      //   }
      //   console.log(phs);
      //   return cb(null, trad);
      // });

    });
  }
};
