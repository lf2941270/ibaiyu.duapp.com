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

exports.update = function (old, newObj, callback) {
	for(var i in newObj){
		old[i] = newObj[i];
	}
	old.save(callback);
}

/**
 * 根据主题ID获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * - lastReply, 最后回复
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
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

/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - count, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getTopicsByQuery = function (query, opt, callback) {
	Topic.find(query, ['_id'], opt, function (err, docs) {
		if (err) {
			return callback(err);
		}
		if (docs.length === 0) {
			return callback(null, []);
		}

		var topics_id = [];
		for (var i = 0; i < docs.length; i++) {
			topics_id.push(docs[i]._id);
		}

		var proxy = new EventProxy();
		proxy.after('topic_ready', topics_id.length, function (topics) {
			// 过滤掉空值
			var filtered = topics.filter(function (item) {
				return !!item;
			});
			return callback(null, filtered);
		});
		proxy.fail(callback);

		topics_id.forEach(function (id, i) {
			exports.getTopicById(id, proxy.group('topic_ready', function (topic, author) {
				// 当id查询出来之后，进一步查询列表时，文章可能已经被删除了
				// 所以这里有可能是null
				if (topic) {
					topic.author = author;
					topic.friendly_create_at = Util.format_date(topic.create_at, true);
					topic.friendly_open_time = Util.format_date(topic.open_time)
				}
				return topic;
			}));
		});
	});
};

/**
 * 获取关键词能搜索到的主题数量
 * Callback:
 * - err, 数据库错误
 * - count, 主题数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query, callback) {
	Topic.count(query, callback);
};