/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'mongoDbServerDev',
  	migrate: 'alter',
  	_hookTimeout: 2000000
  },

  port: 1337,

  session: {
    adapter: 'redis',
    host: 'localhost',
    port: 6379,
    ttl: 84000,
    db: 0,
    pass: '',
    prefix: 'sess:',
  },

  sockets: {
    adapter: 'socket.io-redis',
    host: '127.0.0.1',
    port: 6379,
    db: 1,
    pass: '',
    prefix: 'sock:',
  },

  grunt: {
    _hookTimeout: 2000000
  }

};
