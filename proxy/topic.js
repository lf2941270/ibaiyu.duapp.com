var EventProxy = require('eventproxy');

var models = require('../models');
var Topic = models.Topic;
var User = require('./user');
var Util = require('../libs/util');

/**
 * 创建一条新的开服信息
 * @param {Object} obj 包含必须的开服信息
 */
exports.newAndSave = function (obj, callback) {
	var topic = new Topic();
	topic.game = obj.game;
	topic.open_time = obj.open_time;
	topic.server = obj.server;
	topic.sign_url = obj.sign_url;
	topic.author_id = obj.author_id;
	topic.save(callback);
};

exports.update = function (obj, callback) {

}
exports.getTopicById = function (id, callback) {
	var proxy = new EventProxy();
	var events = ['topic', 'author'];
	proxy.assign(events, function (topic, author) {
		return callback(null, topic, author);
	}).fail(callback);

	Topic.findOne({_id: id}, proxy.done(function (topic) {
		if (!topic) {
			proxy.emit('topic', null);
			proxy.emit('author', null);
			return;
		}
		proxy.emit('topic', topic);

		User.getUserById(topic.author_id, proxy.done('author'));


	}));
};