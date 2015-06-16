function makeNewWindow() {
    chrome.tabs.getSelected(null, function (tab) {
        var srcurl = tab.url;
        console.log("Opening url: " + srcurl);
        windowCreater.makeNewWindow(srcurl);
    });
}

function updatePopupOption() {
    var should_show = localStorage["hide_popup_opt"] == "disabled";
    if (should_show) {
        chrome.browserAction.setPopup({popup: "popup.html"});
        chrome.browserAction.onClicked.removeListener(makeNewWindow);
    } else {
        chrome.browserAction.setPopup({popup: ""});
        chrome.browserAction.onClicked.addListener(makeNewWindow);
    }
};
