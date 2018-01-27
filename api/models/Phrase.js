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

    if ( !_.has(opts, 'page') || isNaN(opts.page) ) opts.page = 1;
    //if ( !_.has(opts, 'limit') ) opts.limit = 5;

    var skip;

    if (opts.page < 0 ) skip = 0;
    else skip = ((opts.page - 1) * opts.limit);

    sails.log.verbose('opts', opts);
    sails.log.verbose('pag', skip);

    Phrase.native(function(err, _Phrase){

      var q = _.has(opts, 'q') ? opts.q : '';
      var query = null;

      if(q){
        var r = '/'+q+'/i';
        query = [
          {$match: {$or: [{ language: Language.mongo.objectId(opts.country_language_id)},{ language: Language.mongo.objectId(opts.language_id)}]}},
          {$group: {_id: "$traduction", phrase: {$push: "$phrase"}, lenguaje: {$push: "$language"}, counter: {$sum: 1}}},
          {$match: {counter: {$gt: 1}, phrase: eval(r)}},
          {$sort: {_id: -1}},
          {$skip: skip},
          {$limit: opts.limit}
        ];
      }else{

        query = [
          {$match: {$or: [{ language: Language.mongo.objectId(opts.country_language_id)},{ language: Language.mongo.objectId(opts.language_id)}]}},
          {$group: {_id: "$traduction", lenguaje: {$push: "$language"}, counter: {$sum: 1}}},
          {$match: {counter: {$gt: 1}}},
          {$sort: {_id: -1}},
          {$skip: skip},
          {$limit: opts.limit}
        ];
      }

      _Phrase.aggregate(query).toArray(function(err, __trads){
        if(err){
          sails.log.error(err);
          return cb(err);
        }
          Phrase.find({ traduction: _.map(__trads, '_id') },{ sort: 'id DESC'}).populateAll().exec(function(err, phrases){
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
            			    obj = { phrase_native: ph.phrase, phrase_native_flag_prefix: ph.language.flag, phrase_native_id: ph.id };
            		else if ( ph.language.id == opts.language_id )
            			    obj = { phrase_language: ph.phrase, phrase_language_flag_prefix: ph.language.flag, phrase_language_id: ph.id };
                else
                  sails.log.debug('no phrase', ph.phrase, ph.language.flag);

                _.extend(_ph, obj); // Get Phrase Id
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
    Traduction.create({comment_text: new Date().toJSON()}).exec(function(err, trad){
      if (err) return cb(err);
      if(_.isArray(trad)) trad = trad[0];

      var phrases = [
        {
          phrase: opts.phrase_native,
          pronuntiation: opts.phrase_native,
          comment_text: opts.phrase_native,
          language: opts.country_language_id,
          traduction: trad.id,
          native: true
        },
        {
          phrase: opts.phrase_language,
          pronuntiation: opts.phrase_language,
          comment_text: opts.phrase_language,
          language: opts.language_id,
          traduction: trad.id,
          native: false
        }
      ];

      try{



      Phrase.create(_.map(phrases, function(phra){return _.omit(phra, 'native');})).exec(function(err, phs){
        if (err){
          return cb(err);
        }
        _.extend(opts, {
          id: trad.id,
          phrase_native_id: _.find(phs, {phrase: opts.phrase_native}).id,
          phrase_language_id: _.find(phs, {phrase: opts.phrase_language}).id,
          phrase_native_flag_prefix: opts.phrase_native_flag_prefix,
          phrase_language_flag_prefix: opts.phrase_language_flag_prefix
        });
        sails.log.debug('opts', opts);
        return cb(null, _.omit(opts, 'comment_text', 'country_language_id', 'language_id', 'source','phrase_language_id'));
      });

      }catch (err){
        console.log(err);
      }

    });
  },
  getOnePhrase: function (opts, cb){

    Phrase.native(function(err, _Phrase){
      _Phrase.aggregate([
        {$match: {$or: [{ language: Language.mongo.objectId(opts.country_language_id)},{ language: Language.mongo.objectId(opts.language_id)}]}},
        {$group: {_id: "$traduction", lenguaje: {$push: "$language"}, counter: {$sum: 1}}},
        {$match: {counter: {$gt: 1}}},
        {$sample: {size: 1} }
      ]).toArray(function(err, __trad){
        if (err) return cb(err);
        __trad = _.isArray(__trad) ? __trad[0] : __trad;
        _Phrase.find({ traduction: Traduction.mongo.objectId(__trad._id) }).toArray(function(err, phrases){
          if (err) return cb(err);
          sails.log.debug('phrases', phrases);
          _.extend(opts, {
            id: __trad._id,
            phrase_native_id: _.find(phrases, {language: Language.mongo.objectId(opts.country_language_id)})._id,
            phrase_native: _.find(phrases, {language: Language.mongo.objectId(opts.country_language_id)}).phrase,
            phrase_language_id: _.find(phrases, {language: Language.mongo.objectId(opts.language_id)})._id,
            phrase_language: _.find(phrases, {language: Language.mongo.objectId(opts.language_id)}).phrase,
            phrase_native_flag_prefix: opts.phrase_native_flag_prefix,
            phrase_language_flag_prefix: opts.phrase_language_flag_prefix
          });

          // sails.log.debug('opts', opts);
          cb(null, _.omit(opts, 'comment_text', 'country_language_id', 'language_id', 'source'));

        }); // Phrase
      }); // aggregate
    }); // native

  }
};
