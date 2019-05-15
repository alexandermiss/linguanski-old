/**
 * UserController.js
 *
 * @module      :: Controller
 * @description :: Provides the base user
 *                 actions used to make waterlock work.
 *
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  _config: {
    actions: true,
    rest: true,
    shortcuts: true
  },

  listnative: async function (req, res){
    var ds = User.getDatastore().manager;

    var db = ds.collection(User.tableName);

    try{
      db.find({}).toArray(function(err, users){
        console.log(users);
        return res.json(users);
      });
    }catch(ex){
      console.log('EXX', ex);
    }
  }

};
