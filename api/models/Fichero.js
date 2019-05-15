/**
 * Fichero.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    user: {model: 'user'},
    public_id: {type: 'string'},
    version: {type: 'string'},
    width: {type: 'string'},
    height: {type: 'string'},
    url: {type: 'string'},
    secure_url: {type: 'string'},
    original_filename: {type: 'string'},
    resource_type: {type: 'string'},
    signature: {type: 'string'},
    type: {type: 'string'},
    format: {type: 'string'},
    bytes: {type: 'number'},

    photo80x80: {type: 'string'}
  },

  getImageByUser: async function(user_id) {
    var fichero;
    fichero   = await Fichero.find({user: user_id}).sort('createdAt DESC');

    if (!fichero)
      fichero   = await Fichero.find({id: '5a08d7582f1f745b1080f6bf'}).sort('createdAt DESC');

      if (_.isArray(fichero)) fichero = fichero[0];

      return fichero;
  },

};
