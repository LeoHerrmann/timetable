window.onload = function() {
    config.load_data();
    translator.translate();
    
    show_options();
}



function show_options() {
    var language_input = document.querySelector("[name='language_input']");
    language_input.value = config.data.language;
    
    show_color_options();
    show_periods_options();
    
    
    
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
            subject_input.setAttribute("size", 9);
            color_input.value = color_value;
            color_input.setAttribute("type", "color");
            
            remove_button.innerText = "X";
            remove_button.classList.add("negative");
            remove_button.onclick = function(e) {
                e.target.parentElement.remove();
            }
        
            input_group.append(subject_input);
            input_group.append(color_input);
            input_group.append(remove_button);
        
            color_settings_group.insertBefore(input_group, add_input_group_button)
        }
    }
    
    
    
    function show_periods_options() {
        var periods_settings_group = document.getElementById("periods_settings_group");
        
        var add_input_group_button = document.createElement("button");
        add_input_group_button.innerText = "Add";
        add_input_group_button.onclick = function() {
            add_input_group("", "")
        }
        periods_settings_group.append(add_input_group_button);
        
        for (period of config.data.periods) {
            add_input_group(period.start, period.end);
        }
        
        function add_input_group(start, end) {
            var add_input_group_button = document.querySelector("#periods_settings_group > button");
            var input_group = document.createElement("div");
            var start_input = document.createElement("input");
            var end_input = document.createElement("input");
            var remove_button = document.createElement("button");
            
            input_group.classList.add("input_group");
            start_input.value = start;
            start_input.setAttribute("type", "time");
            end_input.value = end;
            end_input.setAttribute("type", "time");
            
            remove_button.innerText = "X";
            remove_button.classList.add("negative");
            remove_button.onclick = function(e) {
                e.target.parentElement.remove();
            }
            
            input_group.append(start_input);
            input_group.append(end_input);
            input_group.append(remove_button);
            periods_settings_group.insertBefore(input_group, add_input_group_button);
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
    
    
    var color_settings_input_groups = document.querySelectorAll("#periods_settings_group > .input_group");
    var new_periods = [];
    
    for (input_group of color_settings_input_groups) {
        var inputs = input_group.getElementsByTagName("input");
        var period = {};
        console.log(inputs[0].value)
        period.start = inputs[0].value;
        period.end = inputs[1].value;
        new_periods.push(period);
    }
    
    config.data.periods = new_periods;
    
    
    config.save_data(config.data);
}
