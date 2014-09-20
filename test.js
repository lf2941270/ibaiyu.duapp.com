function timer(){
	console.log('现在是%s',new Date());
	setTimeout(function(){
		timer();
	},1000);
}
timer();