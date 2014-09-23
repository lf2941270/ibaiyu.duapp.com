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