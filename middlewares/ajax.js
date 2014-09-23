/**
 * Created by Administrator on 14-9-23.
 */
exports.setHeader=function(req, res, next){
	res.charset = 'utf-8';
	next();
}