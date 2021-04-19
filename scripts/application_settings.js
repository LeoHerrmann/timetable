var settings_saved = true;



window.onload = function() {
    show_options();

	setup_backup_button();

	var input = document.getElementById("restore_file_input");
	input.addEventListener("change", function() {
	    restore();
	});

    inputs = document.querySelectorAll("#language_input, #dark_mode_input, #disable_hints_input");

    for (input of inputs) {
        input.onchange = function() {
	        settings_saved = false;
	        document.getElementById("save_button").classList.add("positive");
	    }
    }
};



window.onbeforeunload = function(e) {
    if (settings_saved === false) {
        e.preventDefault();
        e.returnValue = "";
        delete e['returnValue'];

        setTimeout(function() {
            document.body.style.opacity = 1;
        }, 500);
    }
};



function show_options() {
    var language_input = document.getElementById("language_input");
    var dark_mode_input = document.getElementById("dark_mode_input");
    var disable_hints_input = document.getElementById("disable_hints_input");

    language_input.value = config.data.language;
    dark_mode_input.checked = config.data.dark_mode_enabled;
    disable_hints_input.checked = config.data.hints_disabled;
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
    var input = document.getElementById("restore_file_input");
    var file = input.files[0];
    var x = 0;

    var reader = new FileReader();

    reader.onload = function(e) {
        try {
            var content = e.target.result;
            var content_json = JSON.parse(content);

            config.data = content_json;
            config.save_data(config.data);

            alert("Settings have been restored. Changes will take effect after page refresh.");
        }

        catch(e) {
            alert("There has been an error restoring your data.");
        }
    }

    reader.readAsText(file);
}



function reset() {
    if (confirm(translator.translate("reset_confirm"))) {
        config.reset_data();
    }
}



function save() {
    var language_input_value = document.getElementById("language_input").value;
    var dark_mode_input_value = document.getElementById("dark_mode_input").checked;
    var disable_hints_input_value = document.getElementById("disable_hints_input").checked;

    config.data.language = language_input_value;
    config.data.dark_mode_enabled = dark_mode_input_value; 
    config.data.hints_disabled = disable_hints_input_value;

    config.save_data(config.data);
    alert("General settings have been saved. Changes will take effect after page refresh.");
    settings_saved = true;
    document.getElementById("save_button").classList.remove("positive");
}
