
module.exports = async function checkToken (req, res, proceed) {

    let check = await sails.helpers.checkToken(req);

    console.log('check', check);

    if(!check) return res.forbidden();

    req.user = check;

    return proceed();

    // Profile.getFullProfile({user: check.id}).then(function(profile){
    //     // sails.log.debug('PROFILE getFullProfile', profile);
    //     req.session['profile'] = profile;
    //     // req.session['image'] = profile.image;
    //     req.session['setting'] = profile.setting;
    //     user['image'] = profile.user.image;
    //     return proceed();
    //   })
    //   .catch(function(err){
    //     return res.json(new Error('Profile not found'));
    //   });

};