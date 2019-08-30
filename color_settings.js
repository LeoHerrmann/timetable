window.onload = function() {
    config.load_data();
    translator.translate_ui();
    
    show_options();
};



function show_options() {  
    show_color_options();

    function show_color_options() {
        var color_settings_group = document.getElementById("color_settings_group");
        var color_input_groups_container = document.getElementById("color_input_groups_container");
        
        var subjects_list = [];
        
        for (day of config.data.timetable) {
            for (period of day.schedule) {
                if (subjects_list.indexOf(period.subject) < 0 && period.subject != "") {
                    subjects_list.push(period.subject);
                }
            }
        }
        
        for (subject of subjects_list) {
            var color = config.data.colors[subject];
        
            color_input_groups_container.innerHTML += 
                "<div class='input_group'>" +
                    `<label>${subject}</label>` +
                    `<input type='color' value='${typeof(color) == "undefined" ? "#000" : color}'`+
                "</div>";
        }
    }
}




var save = {
    colors: function() {
        var color_settings_input_groups = document.querySelectorAll("#color_input_groups_container > .input_group");
        var new_colors = {};
        
        for (input_group of color_settings_input_groups) {
            var label = input_group.getElementsByTagName("label")[0];
            var input = input_group.getElementsByTagName("input")[0];
            
            new_colors[label.innerText] = input.value;
        }
    
        config.data.colors = new_colors;
    
        config.save_data(config.data);
        alert("Color settings have been saved. Changes will take effect after page refresh.");
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
