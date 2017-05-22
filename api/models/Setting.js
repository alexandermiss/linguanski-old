/**
 * Setting.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    country: { model: 'country' },    // Native
    language: { model: 'language' },  // Learning
    user: { model: 'user' },
    learning: { collection: 'settinglanguage', via: 'setting'}
  }
};
