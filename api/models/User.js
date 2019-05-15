/**
 * User
 *
 * @module      :: Model
 * @description :: This is the base user model
 * @docs        :: http://waterlock.ninja/documentation
 */

module.exports = {

  attributes: {
    name: { type: 'string' },
    image: { model: 'fichero' },
    image_url : { type: 'string', defaultsTo: 'https://res.cloudinary.com/linguanski/image/upload/c_thumb,w_80/v1510528855/fu5liml4eovmeasl0ihr.jpg'},

    role: {type: 'string', isIn: ['superadmin', 'admin', 'basic'], defaultsTo: 'basic'},
    suscription: {type: 'string', isIn: ['premium', 'free'], defaultsTo: 'free'},
    activated: {type: 'boolean', defaultsTo: false},
    verified: {type: 'boolean', defaultsTo: false}
  },

  toJSON: function (){
    return _.omit(this, 'password');
  },

  async generateSetting(opts){

    let user = await User.updateOne({id: opts.id}).set({name: opts.name, image: '5a08d7582f1f745b1080f6bf'});
    let setting = await Setting.findOrCreate({user: opts.id}, {user: opts.id, learning: opts.learning, language: opts.language});
    var data = {user, setting};
    console.log('DATADATA', data);
    return data;
  }

};
