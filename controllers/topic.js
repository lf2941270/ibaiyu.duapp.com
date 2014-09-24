/*!
 * nodeclub - controllers/topic.js
 */

/**
 * Module dependencies.
 */

var sanitize = require('validator').sanitize;

var User = require('../proxy').User;
var Topic = require('../proxy').Topic;

var EventProxy = require('eventproxy');
var Util = require('../libs/util');
var util = require('util');

exports.create = function (req, res, next) {
	res.render('topic/edit');
};
exports.showEdit = function (req, res, next) {
	if (!req.session.user) {
		res.redirect('/');
		return;
	}

	var topic_id = req.params.tid;
	if (topic_id.length !== 24) {
		res.render('notify/notify', {error: '此开服信息不存在或已被删除。'});
		return;
	}
	Topic.getTopicById(topic_id, function (err, topic) {
		if (!topic) {
			res.render('notify/notify', {error: '此开服信息不存在或已被删除。'});
			return;
		}
		if (String(topic.author_id) === String(req.session.user._id) || req.session.user.is_admin) {
			res.render('topic/edit', {action: 'edit', topic_id: topic._id, game: topic.game, open_time: Util.format_date(topic.open_time), server: topic.server, sign_url: topic.sign_url});
		} else {
			res.render('notify/notify', {error: '对不起，你不能编辑此话题。'});
		}
	});
}
exports.put = function(req, res, next){
	var topic = {};
	topic.game = sanitize(req.body.game || '').trim();
	topic.open_time = new Date(sanitize(req.body.open_time || '').trim());
	topic.server = parseInt(sanitize(req.body.server || '').trim());
	topic.sign_url = sanitize(req.body.sign_url || '').trim();
	console.log(req.session)
	topic.author_id = req.session.user._id;

	//检测参数是否合法：
	var editError = {};
	if(typeof topic.game !== 'string' || topic.game.length <= 0 || topic.game.length >= 10){
		editError.game = '游戏名称不合法';
	}
	if(topic.open_time == 'Invalid Date'){
		editError.open_time = '开服时间不合法';
	}
	if(isNaN(topic.server)){
		editError.server = '服务器名称不合法';
	}
	if(!(/^(http:\/\/)?lj\.ibaiyu\.cn\/Tg\.html\?action=([A-Z0-9])+/.test(topic.sign_url))){
		editError.sign_url='注册链接不合法';
	}

	//如果检测参数无误，则存储结果
	if(Util.equals(editError,{})){
		Topic.newAndSave(topic, function(err, topic){
			if(err){
				return next(err);
			}
			res.send({success:1,topic:topic})
		})
	}else{
		res.send({success:0,err:editError})
	}

}