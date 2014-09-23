var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*邀请码*/
var InvitationCodeSchema = new Schema({
	code: { type: String }, //邀请码
	create_at: { type: Date, default: Date.now }, //生成时间
	used: { type: Boolean, default: false }, //是否已使用
});

mongoose.model('InvitationCode', InvitationCodeSchema);
