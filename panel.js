chrome.tabs.getCurrent(function (atab) {
	chrome.runtime.sendMessage({remove_mobile_tab_id: atab.id}, function(response){
		if (response["exists"] == true) {
			console.log("reloading...");
			location.reload();	
		};
	});
});

$(document).ready(function() {

	console.log("Sending request for frame src");
	chrome.runtime.sendMessage({get_frame_src: true}, function(response) {
		console.log("Get response for get_frame_src, src=" + response.frame_src);
		update_source_url(response.frame_src);
	});

	window.onresize = resize;

	function resize()
	{
		console.log("resize event detected!");
		$("#player-frame").css("width", $(window).width());
		$("#player-frame").css("height", $(window).height());
		console.log("Size of #player-frame set to " + $(window).width() + "x" + $(window).height());
	}

	window.onresize();
});

var update_source_url = function(url) {
	console.log("Changing src to " + url);
	$("#player-frame").attr("src", url);	

	console.log($("#player-frame").html());
}	

