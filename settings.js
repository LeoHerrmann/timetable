window.onload = function() {
    config.load_data();
    translator.translate();
    
    show_options();
}



function show_options() {
    var language_input = document.querySelector("[name='language_input']");
    language_input.value = config.data.language;
    
    show_color_options();
    
    
    
    function show_color_options() {
        var color_settings_group = document.getElementById("color_settings_group");
    
    
        var add_input_group_button = document.createElement("button");
        
        add_input_group_button.innerText = "Add";
        
        add_input_group_button.onclick = function() {
            add_input_group("", "");
        }
        
        color_settings_group.append(add_input_group_button);
    
    
        for (entry in config.data.colors) {
            add_input_group(entry, config.data.colors[entry]);
        }

        
        function add_input_group(subject_value, color_value) {
            var add_input_group_button = document.querySelector("#color_settings_group > button");
            var input_group = document.createElement("div");
            var subject_input = document.createElement("input");
            var color_input = document.createElement("input");
            var remove_button = document.createElement("button");
        
            input_group.classList.add("input_group");
            subject_input.value = subject_value;
            color_input.value = color_value;
            
            remove_button.innerText = "X";
            remove_button.onclick = function(e) {
                e.target.parentElement.remove();
            }
        
            input_group.append(subject_input);
            input_group.append(color_input);
            input_group.append(remove_button);
        
            color_settings_group.insertBefore(input_group, add_input_group_button)
        }
    }
}



function save_settings() {
    var language_input_value = document.querySelector("[name='language_input']").value;
    config.data.language = language_input_value;
    
    
    var color_settings_input_groups = document.querySelectorAll("#color_settings_group > .input_group");
    var new_colors = {};
    
    for (input_group of color_settings_input_groups) {
        var inputs = input_group.getElementsByTagName("input");
        new_colors[inputs[0].value] = inputs[1].value;
    }
    
    config.data.colors = new_colors;
    
    
    config.save_data(config.data);
    //localStorage.setItem("config_data", JSON.stringify(config.data));
}
