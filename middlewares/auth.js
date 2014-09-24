/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
  if (!req.session.user) {
    return res.render('notify/notify', {error: '你还没有登录。'});
  }
  if (!req.session.user.is_admin) {
    return res.render('notify/notify', {error: '该操作需要管理员权限。'});
  }
  next();
};

/**
 * 需要登录
 */
exports. userRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    return res.send( 'forbidden!',403);//修改参数顺序
  }
  next();
};

/**
 * 需要登录，响应错误页面
 */
exports.signinRequired = function (req, res, next) {
  if (!req.session.user) {
    res.render('notify/notify', {error: '未登入用户不能发布话题。'});
    return;
  }
  next();
};

exports.blockUser = function () {
  return function (req, res, next) {
    if (req.session.user && req.session.user.is_block && req.originalUrl !== '/signout') {//封禁账号后禁止其它一切操作，除了退出登录操作
			res.render('notify/notify', {error: '您的账号已被封禁，请联系管理员解封。'});
			return;
//      return res.send('您被屏蔽了。');
    }
    next();
  };
}
