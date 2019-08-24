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
        var add_input_group_button = document.createElement("button");
        
        add_input_group_button.innerText = translator.translate("add");
        add_input_group_button.onclick = function() {
            add_input_group("", "");
        }
        
        
        color_settings_group.append(add_input_group_button);


        for (entry in config.data.colors) {
            add_input_group(entry, config.data.colors[entry]);
        }

        
        function add_input_group(subject_value, color_value) {
            var color_input_groups_container = document.getElementById("color_input_groups_container");
            
            color_input_groups_container.innerHTML += 
                "<div class='input_group'/>" + 
                    `<input value='${subject_value}' size='9'/>` +
                    `<input value='${color_value}' type='color'/>` +
                    "<button class='negative' onclick='remove_parent_input_group(this)'>X</button>" +
                "</div>";
        }
    }
    
    
    
    function show_periods_options() {
        var periods_settings_group = document.getElementById("periods_settings_group");
        var add_input_group_button = document.createElement("button");
        
        add_input_group_button.innerText = translator.translate("add");
        add_input_group_button.onclick = function() {
            add_input_group("", "");
        };
        
        periods_settings_group.append(add_input_group_button);
        
        for (period of config.data.periods) {
            add_input_group(period.start, period.end);
        }
        
        function add_input_group(start, end) {
            var periods_input_groups_container = document.getElementById("periods_input_groups_container");
            
            periods_input_groups_container.innerHTML += 
                "<div class='input_group'>" + 
                    `<input type='time' value='${start}'/>` +
                    `<input type='time' value='${end}'/>` +
                    "<button class='negative' onclick='remove_parent_input_group(this);'>X</button>" +
                "</div>";
        }
    }
    
    
    
    function show_timetable_options() {
        var timetable_settings_group = document.getElementById("timetable_settings_group");
        
        for (day_object of config.data.timetable) {            
            timetable_settings_group.innerHTML += 
                "<div class='input_group'>" + 
                    `<input name='day_name_input' value='${day_object.day}'/>` + 
                "</div>";
            
            
            var schedule_inputs_container = document.createElement("div");
            schedule_inputs_container.classList.add("schedule_inputs_container");
            
            
            for (var i = 0; i < config.data.periods.length; i++) {
                try {
                    add_period_input_group(day_object.schedule[i].subject, day_object.schedule[i].room);
                }
                catch (TypeError) {
                    add_period_input_group("", "");
                }
            }
            
            timetable_settings_group.append(schedule_inputs_container);
        }
        
        
        function add_period_input_group(subject, room) {
            schedule_inputs_container.innerHTML += 
                "<div class='input_group'>" +
                    `<input value='${subject}'/>` +
                    `<input value='${room}'/>` +
                "</div>"; 
        }
    }
}



function remove_parent_input_group(clicked_button) {
    clicked_button.parentElement.remove();
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





function save_general_settings() {
    var language_input_value = document.querySelector("[name='language_input']").value;
    config.data.language = language_input_value;
    
    config.save_data(config.data);
    alert("General settings have been saved. Changes will take effect after page refresh.")
}


function save_color_settings() {
    var color_settings_input_groups = document.querySelectorAll("#color_input_groups_container > .input_group");
    var new_colors = {};
    
    for (input_group of color_settings_input_groups) {
        var inputs = input_group.getElementsByTagName("input");
        new_colors[inputs[0].value] = inputs[1].value;
    }
    
    config.data.colors = new_colors;
    
    config.save_data(config.data);
    alert("Color settings have been saved. Changes will take effect after page refresh.")
}


function save_periods_settings() {
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
    alert("Periods settings have been saved. Changes will take effect after page refresh.")
}


function save_timetable_settings() {
    var day_name_inputs = document.querySelectorAll("#timetable_settings_group [name='day_name_input']");
    var schedule_input_group_containers = document.querySelectorAll("#timetable_settings_group > .schedule_inputs_container");
    
    if (day_name_inputs.length != schedule_input_group_containers.length) {
        alert("Error saving timetable settings");
        return false;
    }
    
    
    var new_timetable = [];
    
    for (var i = 0; i < day_name_inputs.length; i++) {
        var schedule_input_groups = schedule_input_group_containers[i].getElementsByClassName("input_group");
    
        var new_timetable_day = {
            day: day_name_inputs[i].value,
            schedule: []
        }
        
        for (input_group of schedule_input_groups) {
            var subject = input_group.children[0].value;
            var room = input_group.children[1].value;
            
            new_timetable_day.schedule.push({
                "subject": subject,
                "room": room,
            });
        }
        
        new_timetable.push(new_timetable_day);
    }
    
    console.log(new_timetable);
    
    config.data.timetable = new_timetable;
    config.save_data(config.data);
    alert("Timetable settings have been saved. Changes will take effect after page refresh.")
}
