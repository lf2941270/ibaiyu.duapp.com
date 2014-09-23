var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config').config;

var UserSchema = new Schema({
  name: { type: String, index: true },//昵称
  loginname: { type: String, unique: true },//用户名
  pass: { type: String },//密码
  email: { type: String, unique: true },//邮箱
  is_block: {type: Boolean, default: false},//是否被封禁

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },//是否被激活
});

mongoose.model('User', UserSchema);
