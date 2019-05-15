module.exports = {


    friendlyName: 'Create token',
  
  
    description: 'Return a new token',
  
  
    inputs: {
      id: {
        type: 'string',
        required: true
      }
    },
  
  
    exits: {
  
    },
  
  
    fn: async function (inputs, exits) {
  
      const jwt = require('jwt-simple');
      // const moment = require('moment');
      // let exp = moment().add(1, 'days').valueOf();
  
      let token = jwt.encode({
        user: inputs.id
      }, 'abc');
  
      return exits.success({token: token});
  
    }
  
  
  };
  
  