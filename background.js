var PanelWindowIds = [];
var MobileTabIDs = [];

var addPanelWindowId = function(windowId) {
    if (PanelWindowIds.indexOf(windowId) <= -1) {
        PanelWindowIds.push(windowId);
        addMobileTabId(windowId + 1);
    };
};

var removePanelWindowId = function(windowId) {
    var index = PanelWindowIds.indexOf(windowId);
    if (index > -1) {
        PanelWindowIds.splice(index, 1);
    };

    removeMobileTabId(windowId + 1);
};


var addMobileTabId = function(tabId) {
    if (MobileTabIDs.indexOf(tabId) <= -1) {
        MobileTabIDs.push(tabId);    
    };
};

var removeMobileTabId = function(tabId) {
    var index = MobileTabIDs.indexOf(tabId);
    if (index > -1) {
        MobileTabIDs.splice(index, 1);
        return true;
    };
    return false;
};

var removeMobileTabListener = function(request, sender, sendResponse) {
    if (request.hasOwnProperty('remove_mobile_tab_id')) {
        var idExists = false;
        console.log("Trying to remove mobile tab id " + request['remove_mobile_tab_id']);
        if( removeMobileTabId(request['remove_mobile_tab_id']) == true) {
            idExists = true;
            console.log("Removed");
        } else {
            idExists = false;
            console.log("Does not exist");
        };
        sendResponse({exists: idExists});
    }
}

chrome.runtime.onMessage.addListener(removeMobileTabListener);

var MobileViewExceptions = ["plus.google.com/hangouts/"];

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var mobile_view_opt = localStorage["mobile_view_opt"];
    if (mobile_view_opt == "disabled") {
        return {requestHeaders: details.requestHeaders};
    };
    
    for (url_p in MobileViewExceptions) {
        if (details.url.indexOf(url_p) > -1) {
            return {requestHeaders: details.requestHeaders};
        };
    };
    if (MobileTabIDs.indexOf(details.tabId) > -1) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders[i].value = "Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19";  
                break;
            }
        }
    }
    return {requestHeaders: details.requestHeaders};
  },
  {urls: ["<all_urls>"]},
  ["blocking", "requestHeaders"]);


chrome.windows.onCreated.addListener(function(aWindow) {
    var isPanelWindow = (aWindow.type == "panel");
    if (isPanelWindow) {
        addPanelWindowId(aWindow.id);
    };
});

chrome.windows.onRemoved.addListener(function(windowId) {
    removePanelWindowId(windowId);
});


function onGetURL(srcurl) {
    var prefix = "panel://";
    var suffix = "#panel";
    if (srcurl.indexOf(prefix) == 0) {
        srcurl = srcurl.substr(prefix.length);
        windowCreater.makeNewWindow(srcurl);
        return true;
    } else if (srcurl.indexOf(suffix) != -1) {
        srcurl = srcurl.substr(0, srcurl.indexOf(suffix)) + srcurl.substr(srcurl.indexOf(suffix) + suffix.length);
        windowCreater.makeNewWindow(srcurl);
        return true;
    } else {
        var encoded_prefix = "panel%3A%2F%2F";
        var parsed = parseURL(srcurl);
        srcurl = parsed.params.q;
        if (srcurl && srcurl.indexOf(encoded_prefix) == 0) {
            srcurl = srcurl.substr(encoded_prefix.length);
            windowCreater.makeNewWindow(srcurl);
            return true;
        }
    } 

    return false;
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.get_frame_src == true) {
            console.log("get request for get_frame_src, src=" + windowCreater.sharedFrameSrc);
            sendResponse({frame_src: windowCreater.sharedFrameSrc});
            return true;
        }
        return false;
});

console.log("get_frame_src listener set");

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.create_new_window == true) {
            console.log("get request to create new window, src=" + request.srcurl);
            sendResponse({got_url: request.srcurl});
            windowCreater.makeNewWindow(request.srcurl);
            return true;
        }
        return false;
});

chrome.contextMenus.create({"id": "pipviewercm", "title": "Open Link in Panel", "contexts": ["link", "image", "video", "audio"]}, null);
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == "pipviewercm") {
        if (info.linkUrl !== undefined) {
            windowCreater.makeNewWindow(info.linkUrl);
        } else {
            windowCreater.makeNewWindow(info.srcUrl);
        }
    }
});


// // // Which one would be better?

// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     console.log(tab.id);
//     if (onGetURL(tab.url)) {
//         chrome.tabs.remove(tab.id, null);
//     }
// });

// chrome.tabs.onCreated.addListener(function(tab) {
//     console.log(tab.id);
//     if (onGetURL(tab.url)) {
//         chrome.tabs.remove(tab.id, null);
//     }
// });

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    var tabId = details.tabId;
    var url = details.url;
    if (onGetURL(url)) {
        chrome.tabs.remove(tabId, null);
    }
});

// chrome.webNavigation.onCommitted.addListener(function (details) {
//     console.log(details.url);
// });


updatePopupOption();

