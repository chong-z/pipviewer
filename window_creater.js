
var windowCreater = {
    
    makeNewWindow: function(srcurl) {
        if (srcurl.indexOf("http://") != 0 && srcurl.indexOf("https://") != 0 && srcurl.indexOf("file://") != 0 && srcurl.indexOf("chrome://") != 0) {
            // Needs a procotol
            srcurl = "http://" + srcurl;
        }

        var frameType = this.getFrameType(srcurl);
        var embed_view_opt = localStorage["embed_view_opt"];

        if (embed_view_opt == "enabled" && frameType != "") {
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

    sharedFrameSrc: "http://",

    createFrameWindow_: function(src) {
        var createData = {
            url: "panel.html",
            type: "panel",
        };

        windowCreater.sharedFrameSrc = src;

        chrome.windows.create(createData, this.onFrameWindowCreated_);
    },

    createURLWindow_: function(aurl) {
        var createData = {
            url: aurl,
            type: "panel",
        };

        console.log("New url is " + aurl);
        
        chrome.windows.create(createData, this.onURLWindowCreated_);
    },

    onFrameWindowCreated_: function(window) {
        var isPanelEnabled = window.alwaysOnTop;

        if (!isPanelEnabled) {
            chrome.windows.remove(window.id, null);
        };
    },

    onURLWindowCreated_: function(window) {
        var isPanelEnabled = window.alwaysOnTop;

        if (!isPanelEnabled) {
            chrome.windows.remove(window.id, null);
        } else {


        };
    },
    
};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.get_frame_src == true) {
            console.log("get request for get_frame_src, src=" + windowCreater.sharedFrameSrc);
            sendResponse({frame_src: windowCreater.sharedFrameSrc});
        }
});

console.log("get_frame_src listener set");
