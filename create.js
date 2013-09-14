
var windowCreater = {
 	
	makeNewWindow: function() {
		var srcurl = $('input[name="src_URL"]').val();

		var frameType = this.getFrameType(srcurl);

		if (frameType != "") {
			var frameSrc = this.convertToFrameSrc(srcurl, frameType);
			this.createFrameWindow_(frameSrc);
		} else {
			this.createURLWindow_(srcurl);
		}

	},

	getFrameType: function(url) {
		for (var anItem in this.frameSrcPattern_) {
			var currentPattern = this.frameSrcPattern_[anItem];
			if (url.indexOf(currentPattern) != -1) {
				return anItem;
			}
		};
		
		return "";
	},

	convertToFrameSrc: function(url, frameType) {
		var frameSrc = "";

		if (frameType == "youtube") {
			var videoId = url.substr(url.indexOf("?v=")+3, 11);
			frameSrc = "http://www.youtube.com/embed/{video_id}?feature=player_detailpage";
			frameSrc = frameSrc.replace("{video_id}", videoId);
		} else if (frameType == "youku") {
			var videoId = url.substr(url.indexOf("id_")+3, 13);
			frameSrc = "http://player.youku.com/embed/{video_id}";
			frameSrc = frameSrc.replace("{video_id}", videoId);
		} else if (frameType == "flash") {
			frameSrc = url;
		}

		return frameSrc;
	},

	frameSrcPattern_: {"youtube": "www.youtube.com/watch?v=",
						"youku": "v.youku.com/v_show/id_",
						"flash": ".swf"},

	createFrameWindow_: function(src) {
		var createData = {
			url: "panel.html",
			type: "panel",
		};
		
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {

				if (request.get_frame_src == true) {
					console.log("get request for get_frame_src, src=" + src);
					sendResponse({frame_src: src});
				}
		});

		console.log("get_frame_src listener set");

		chrome.windows.create(createData, this.onFrameWindowCreated_);
	},

	onFrameWindowCreated_: function(window) {
	},

	createURLWindow_: function(aurl) {
		var createData = {
			url: aurl,
			type: "panel",
		};

		console.log("New url is " + aurl);
		
		chrome.windows.create(createData, this.onURLWindowCreated_);
	},

	onURLWindowCreated_: function(window) {
	},
	
};

document.addEventListener('DOMContentLoaded', function () {

	chrome.tabs.getSelected(null, function (tab) {
		$('input[name="src_URL"]').val(tab.url);

		// Create the window immediately or wait for the button event
		var srcurl = $('input[name="src_URL"]').val();
		if (srcurl != "chrome://newtab/") {
			windowCreater.makeNewWindow();
		} else {
			$('input[name="src_URL"]').val("http://")
		}

	});

	$("#new_panel_btn").click(function() {
	    windowCreater.makeNewWindow();
	    return false;
	});

});
