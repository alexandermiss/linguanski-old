
module.exports = function (req, res, next){

  User.findOne(req.session.user.id).exec(function(err, user){
    if(err) return res.negotiate(err);

    if(!user.activated)
      return res.view('auth/inactiveuser', {layout: false});
    return next();
  });

}
