/**
 * Friend.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    friend_one: {model: 'user'},
    friend_two: {model: 'user'},
    status: {enum: ['pending', 'friend', 'me'], defaultsTo: 'pending'}
  }
};
