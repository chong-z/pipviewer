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

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
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
    var isPanelWindow = aWindow.alwaysOnTop;
    if (isPanelWindow) {
        addPanelWindowId(aWindow.id);
    };
});

chrome.windows.onRemoved.addListener(function(aWindow) {
    removePanelWindowId(aWindow.id);
});



