/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sign = require('./controllers/sign');
var site = require('./controllers/site');
var user = require('./controllers/user');
var message = require('./controllers/message');
var tag = require('./controllers/tag');
var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var rss = require('./controllers/rss');
var upload = require('./controllers/upload');
var assets = require('./controllers/static');
var tools = require('./controllers/tools');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var ajax = require('./middlewares/ajax');
var status = require('./controllers/status');
var github = require('./controllers/github');

var passport = require('passport');
var configMiddleware = require('./middlewares/conf');
var config = require('./config');


module.exports = function (app) {
	app.all('*',auth.blockUser());
  // home page
  app.get('/', site.index);

	app.get('/signup', sign.showSignup); //显示注册页
	app.post('/signup', sign.signup); //提交注册表单
	app.post('/signout', sign.signout); //退出登录
	app.get('/signin', sign.showLogin); //显示登录页
	app.post('/signin', sign.login); //提交登录表单
	app.get('/active_account', sign.active_account);

	app.get('/topic/:tid/edit', topic.showEdit);  // 编辑开服
	app.get('/topic/create', auth.signinRequired, topic.create);

  app.post('/topic/create', auth.signinRequired, topic.put);//新建开服
	app.post('/topic/:tid/edit',auth.signinRequired, topic.update);//编辑开服
	app.post('/topic/:tid/delete',auth.signinRequired, topic.delete);//删除开服

	/*邀请码*/
	app.get('/invitation', auth.adminRequired, sign.showInvitation);//显示邀请码页面
	app.post('/invitation/:num', auth.adminRequired, ajax.setHeader, sign.createInvitationCode);


	app.get('*', site.notFound); // 404
};
