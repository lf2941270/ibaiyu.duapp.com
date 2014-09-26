/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var User = require('../proxy').User;
var Topic = require('../proxy').Topic;
var Tag = require('../proxy').Tag;
var config = require('../config').config;
var EventProxy = require('eventproxy');



exports.index = function (req, res, next) {
	var uid= req.query.uid || '';
	var page = parseInt(req.query.page, 10) || 1;	//当前页数
	page = page > 0 ? page : 1;
	var limit = config.list_topic_count; //每页显示开服信息条数

	var proxy = EventProxy.create('topics', 'pages',
			function (topics, pages) {
				res.render('index', {
					topics: topics,
					current_page: page,
					list_topic_count: limit,
					pages: pages,
					uid: uid,
					site_links: config.site_links,
					keyword: '',
					"layout":"layoutIndex"
				});
			});
	proxy.fail(next);

	// 取主题
	var query = {};
	proxy.on('query',function(query){
		var options = {
			skip: (page - 1) * limit,
			limit: limit,
			sort: [
				['top', 'desc' ],
				[ 'open_time', 'desc' ]
			] };
		var optionsStr = JSON.stringify(options);

		Topic.getTopicsByQuery(query, options, proxy.done('topics', function (topics) {
			return topics;
		}));
		// 取分页数据

		Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
			var pages = Math.ceil(all_topics_count / limit);
			proxy.emit('pages', pages);
		}));
	})
	if (uid !== '') {
		if(/^[a-z0-9]{24}$/.test(uid)){
			User.getUserById(uid, function(err, docs){
				if(err){
					return next(err);
				}
				if(docs === null) {
					return res.redirect('/')
				}
				query.author_id = uid;
				proxy.emit('query',query)
			})
		}	else{
			return res.redirect('/');
		}
	}else{
		proxy.emit('query',query)
	}





};

/**
 * 404 Not Found
 */
exports.notFound = function(req, res, next) {
	return res.render('404')
}
