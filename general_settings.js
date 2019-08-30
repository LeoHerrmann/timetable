window.onload = function() {
    config.load_data();
    translator.translate_ui();
    
    show_options();
	setup_backup_button();
};



function show_options() {
    var language_input = document.querySelector("[name='language_input']");
    language_input.value = config.data.language;
}




function setup_backup_button() {
    var data_string = JSON.stringify(config.data);
    var data_uri = "data:application/json; charset=utf-8," + encodeURIComponent(data_string);
        
    var file_name = "timetable_data_backup.json";
        
    var link_element = document.getElementById("backup_button").parentElement;
    link_element.setAttribute("href", data_uri);
    link_element.setAttribute("download", file_name);
}






function restore() {
    alert("Sorry, this feature hasn't been implemented yet.");
}
function reset() {
    if (confirm(translator.translate("reset_confirm"))) {
        config.reset_data();
    }
}









var save = {
    general: function() {
        var language_input_value = document.querySelector("[name='language_input']").value;
        config.data.language = language_input_value;
    
        config.save_data(config.data);
        alert("General settings have been saved. Changes will take effect after page refresh.");
    }
};








function toggle_settings_group_state(clicked_button) {
    var parent_settings_group = clicked_button.parentElement.parentElement;
    
    if (parent_settings_group.classList.contains("closed")) {
        parent_settings_group.classList.remove("closed");
        clicked_button.classList.remove("icon-arrow-down");
        clicked_button.classList.add("icon-arrow-up");
    }
    else {
        parent_settings_group.classList.add("closed");
        clicked_button.classList.remove("icon-arrow-up");
        clicked_button.classList.add("icon-arrow-down");
    }
}
