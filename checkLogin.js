//未登录
function noLogin(req, res, next){
    if(!req.session.user){
        console.log('抱歉，您还没有登录！');
        return res.redirect('/login');
    }
    next();
}
function alreadyLogin(req, res, next){
  console.log(res.session);
  if(res.session  && res.session.user){
    return res.redirect('/register');
  }
    next();
}
exports.noLogin = noLogin;
exports.alreadyLogin = alreadyLogin;
