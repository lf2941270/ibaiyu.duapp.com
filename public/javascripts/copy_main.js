$(document).ready(function(){
	var clip = new ZeroClipboard($(".my_clip_button"));

	clip.on("ready", function() {
		console.log("Flash movie loaded and ready.");

		this.on("aftercopy", function(event) {
			alert( event.data["text/plain"] + " 已成功复制到剪贴板！");
		});
	});

	clip.on("error", function(event) {
		$(".demo-area").hide();
		alert('error[name="' + event.name + '"]: ' + event.message);
		ZeroClipboard.destroy();
	});
})