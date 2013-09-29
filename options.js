
// Restores select box state to saved value from localStorage.
function restore_options() {

    $(".options_checkbox").each(function(){
        var boxName = $(this).attr("name");
        var value = localStorage[boxName];

        if (!value) {
            value = "enabled";
            localStorage[boxName] = value;
        };

        if (value == "enabled") {
            this.checked = true;
        } else {
            this.checked = false;
        };

    });
}
document.addEventListener('DOMContentLoaded', function(){
    restore_options();

    $(".options_checkbox").click(function(){
        var boxName = $(this).attr("name");
        var isChecked = $(this).is(':checked');
        var value = "enabled";
        if (!isChecked) {value = "disabled";};
        localStorage[boxName] = value;
    });
});
