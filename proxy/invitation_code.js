var EventProxy = require('eventproxy');

var models = require('../models');
var InvitationCode = models.InvitationCode;
var User = require('./user');
var Util = require('../libs/util');

/**
 * 创建并存储一组邀请码
 * @param {Array} codes 包含若干邀请码的数组
 */
exports.newAndSave = function(codes, callback) {
	var proxy = new EventProxy();
	proxy.after('save', codes.length, function(){
		callback(null, codes);
	}).fail(callback);
	codes.forEach(function(code){
		var invitationCode = new InvitationCode();
		invitationCode.code = code;
		invitationCode.save(function(err, invitationCode){
			if(err){
				return callback(err);
			}else{
				proxy.emit('save');
			}
		})
	})
}

/**
 * 根据邀请码取出对应的记录
 * @param {String} code 邀请码
 */
exports.getOneByCode = function(code, callback) {
	InvitationCode.findOne({code: code},function(err, invitationCode) {
		if(err){
			return callback(err);
		}
		callback(null,invitationCode);
	})
}

/**
 *取出表中所有记录
 **/
exports.getAllCodes = function(opt, callback) {
	InvitationCode.find({}, [], opt, function (err, docs) {
		if (err) {
			return callback(err);
		}
		return callback(null, docs);
	});
}

/**
 *取出表中邀请码的条数
 **/
exports.getCounts = function(callback){
	InvitationCode.count(callback);
}