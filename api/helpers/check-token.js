const jwt = require('jwt-simple');

module.exports = {


  friendlyName: 'Check token',


  description: '',


  inputs: {
    req: {
      type: 'ref',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let token;
    
    const req = inputs.req;
    
    if(req.headers.authorization) {
      console.log('authorizationauthorization');
      let split = req.headers.authorization.split(' ');
      if(split.length != 2) {
        return exits.success(null);
      }
  
      token = split[1];
    }else{
      console.log('allParamsallParams');
      let params = req.allParams();

      if(!_.has(params, 'access_token')) {
        return exits.success(null);
      }

      token = params.access_token;
    }

    try{
      let decoded;
      decoded = jwt.decode(token, 'abc');
      console.log('decodeddecoded', decoded);
      let user = await User.findOne({id: decoded.user});
      if(!user) {
        return exits.success(null);
      }
  
      return exits.success(user);
    }catch(e){
      return exits.success({message: 'Invalid token'});
    }

  }


};

