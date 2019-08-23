window.onload = function() {
    config.load_data();
    translator.translate_ui();
    
    show_options();
}



function show_options() {
    var language_input = document.querySelector("[name='language_input']");
    language_input.value = config.data.language;
    
    show_color_options();
    show_periods_options();
    show_timetable_options();
    
    
    
    function show_color_options() {
        var color_settings_group = document.getElementById("color_settings_group");
        var color_input_groups_container = document.createElement("div");
        var add_input_group_button = document.createElement("button");
        
        color_input_groups_container.setAttribute("id", "color_input_groups_container");
        add_input_group_button.innerText = translator.translate("add");//"Add";
        add_input_group_button.onclick = function() {
            add_input_group("", "");
        }
        
        color_settings_group.append(color_input_groups_container);
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
        
            color_input_groups_container.append(input_group);
        }
    }
    
    
    
    function show_periods_options() {
        var periods_settings_group = document.getElementById("periods_settings_group");
        var periods_input_groups_container = document.createElement("div");
        var add_input_group_button = document.createElement("button");
        
        periods_input_groups_container.setAttribute("id", "periods_input_groups_container");
        
        add_input_group_button.innerText = translator.translate("add");
        add_input_group_button.onclick = function() {
            add_input_group("", "");
        };
        
        periods_settings_group.append(periods_input_groups_container);
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
            periods_input_groups_container.append(input_group);
        }
    }
    
    
    
    function show_timetable_options() {
        var timetable_settings_group = document.getElementById("timetable_settings_group");
        
        for (day_object of config.data.timetable) {
            var day_name_input_group = document.createElement("div");
            var day_name_input = document.createElement("input");
            
            day_name_input_group.classList.add("input_group");
            day_name_input.setAttribute("name", "day_name_input");
            day_name_input.value = day_object.day;
            
            day_name_input_group.append(day_name_input);
            console.log(timetable_settings_group)
            timetable_settings_group.append(day_name_input_group);
            
            
            
            var schedule_inputs_container = document.createElement("div");
            schedule_inputs_container.classList.add("schedule_inputs_container");
            
            for (period of day_object.schedule) {
                var periods_input_group = document.createElement("div");
                var subject_input = document.createElement("input");
                var room_input = document.createElement("input");
                
                periods_input_group.classList.add("input_group");
                subject_input.value = period.subject;
                room_input.value = period.room;
                
                periods_input_group.append(subject_input);
                periods_input_group.append(room_input);
                schedule_inputs_container.append(periods_input_group);
            }
            
            timetable_settings_group.append(schedule_inputs_container);
        }
    }
}



function backup() {
    alert("Sorry, this feature hasn't been implemented yet.");
}
function restore() {
    alert("Sorry, this feature hasn't been implemented yet.");
}
function reset() {
    if (confirm(translator.translate("reset_confirm"))) {
        config.reset_data();
    }
}



function save_settings() {
    var language_input_value = document.querySelector("[name='language_input']").value;
    config.data.language = language_input_value;
    
    
    var color_settings_input_groups = document.querySelectorAll("#color_input_groups_container > .input_group");
    var new_colors = {};
    
    for (input_group of color_settings_input_groups) {
        var inputs = input_group.getElementsByTagName("input");
        new_colors[inputs[0].value] = inputs[1].value;
    }
    
    config.data.colors = new_colors;
    
    
    var periods_settings_input_groups = document.querySelectorAll("#periods_input_groups_container > .input_group");
    var new_periods = [];
    
    for (input_group of periods_settings_input_groups) {
        var inputs = input_group.getElementsByTagName("input");
        var period = {};
        console.log(inputs[0].value)
        period.start = inputs[0].value;
        period.end = inputs[1].value;
        new_periods.push(period);
    }
    
    config.data.periods = new_periods;
    
    
    config.save_data(config.data);
    alert(translator.translate("data_saved"))
}
