module.exports = {


    friendlyName: 'Generate password',
  
  
    description: 'Generate password',
  
  
    inputs: {
      password: {
        type: 'string',
        required: true
      }
    },
  
  
    exits: {
      noPassword: {
        message: 'The password does not exists!'
      }
    },
  
  
    fn: async function (inputs, exits) {
  
      const bcrypt = require('bcrypt');
  
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(inputs.password, salt);
      
      return exits.success(hash);
  
    }
  
  
  };
  
  