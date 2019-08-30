window.onload = function() {
    config.load_data();
    translator.translate_ui();
    
    show_options();
};



function show_options() {    
    show_periods_options();
    
    
    
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
                    "<button class='negative' onclick='this.parentElement.remove();'>X</button>" +
                "</div>";
        }
    }
}





var save = {   
    periods: function() {
        var periods_settings_input_groups = document.querySelectorAll("#periods_input_groups_container > .input_group");
        var new_periods = [];
    
        for (input_group of periods_settings_input_groups) {
            var inputs = input_group.getElementsByTagName("input");
            var period = {};
            
            period.start = inputs[0].value;
            period.end = inputs[1].value;
            new_periods.push(period);
        }
    
        config.data.periods = new_periods;
    
        config.save_data(config.data);
        alert("Periods settings have been saved. Changes will take effect after page refresh.");
    },
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
