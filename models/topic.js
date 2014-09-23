var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/*发布的开服表数据模型*/
var TopicSchema = new Schema({
  game: { type: String },//游戏名称
  open_time: { type: Date },//开服时间
	server: { type: Number, default: 0 },//开服服务器名称
	sign_url:{ type: String },//推广链接地址
  author_id: { type: ObjectId },//发布者id
  top: { type: Boolean, default: false },//是否置顶
  visit_count: { type: Number, default: 0 },//点击次数
  create_at: { type: Date, default: Date.now },//发布时间
  update_at: { type: Date, default: Date.now },//最后修改时间
});

mongoose.model('Topic', TopicSchema);
