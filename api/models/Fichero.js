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

};
