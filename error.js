document.getElementById("flags_tab_link").addEventListener("click", function() {
    chrome.tabs.create({url:'chrome://flags/#enable-panels'});
});
