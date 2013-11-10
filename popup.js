
function bkmakeNewWindow(srcurl) {
    chrome.runtime.sendMessage({create_new_window: true, srcurl: srcurl}, function(response){
        console.log("Url got by background page: " + response.got_url);
    });
}


document.addEventListener('DOMContentLoaded', function () {

    chrome.tabs.getSelected(null, function (tab) {
        $('input[name="src_URL"]').val(tab.url);

        // Create the window immediately or wait for the button event
        var srcurl = $('input[name="src_URL"]').val();
        if (srcurl.indexOf("chrome://newtab") == -1) {
            if (localStorage["open_current_tab_opt"] != "disabled") {
                bkmakeNewWindow(srcurl);
            }
        } else {
            $('input[name="src_URL"]').val("http://")
        }

    });

    $("#new_panel_btn").click(function() {
        var srcurl = $('input[name="src_URL"]').val();

        if (srcurl.indexOf("chrome://newtab") == -1) {
            bkmakeNewWindow(srcurl);
        };
    });

    $("#options_icon").click(function() {
        $("#options_frame").stop();
        var isShown = false;
        if ($("#options_frame").height() > 0) {isShown = true;};
        
        console.log("clicked");

        if (!isShown) {
            $("#options_frame").css("display", "block");
            $("#options_frame").animate({height: "70px"}, 300);
        } else {
            $("#options_frame").animate({height: "0px"}, 150, function(){
                $("#options_frame").css("display", "none");
            });
        };
    });

    $("#a_url_box").keydown(function(e){
        if (e.keyCode == 13) {
            $("#new_panel_btn").trigger("click");
        };
    });

    $("#flags_tab_link").click(function() {
        chrome.tabs.create({url: "chrome://flags/#enable-panels"}, null);
    });

    $("#fb-button").click(function () {
        bkmakeNewWindow("https://www.facebook.com/");
    });

    $("#gk-button").click(function () {
        bkmakeNewWindow("https://drive.google.com/keep/");
    });

});
