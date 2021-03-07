var settings_saved = true;



window.onload = function() {
    show_options();
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
    var color_settings_group = document.getElementById("color_settings_group");
    var color_input_groups_container = document.getElementById("color_input_groups_container");

    var subjects_in_schedule = get_subjects_in_schedule();

    for (let subject in config.data.colors) {
        let hue = config.data.colors[subject];

        let new_input_group = 
            "<div class='input_group'>" +
                `<label>${subject}</label>` +
                `<input type='range' min='0' max='360' value='${hue}'/>` +
                `<div class="color_preview" style="background-color: hsl(${hue}, 100%, 50%)"></div>`;

        if (subjects_in_schedule.indexOf(subject) >= 0) {
            new_input_group += `<button onclick="remove_color(this);" class="icon-delete" disabled></button>`
        }
        else {
            new_input_group += `<button onclick="remove_color(this);" class="icon-delete"></button>` 
        }

        new_input_group += "</div>"; 

        color_input_groups_container.innerHTML += new_input_group;
    }

    var inputs = document.getElementsByTagName("input");
    for (input_element of inputs) {
        input_element.onchange = function(e) {
            settings_saved = false;
            document.getElementById("save_button").classList.add("positive");
            e.target.parentElement.getElementsByClassName("color_preview")[0].style.backgroundColor = `hsl(${e.target.value}, 100%, 50%)`;
        }
    }

    function get_subjects_in_schedule() {
        var subjects_in_schedule = [];

        for (let day of config.data.timetable) {
            let schedule = day.schedule;

            for (let period of schedule) {
                if (subjects_in_schedule.indexOf(period.subject) == -1 && period.subject != "") {
                    subjects_in_schedule.push(period.subject);
                }
            }
        }

        return subjects_in_schedule;
    }
}


function remove_color(clicked_element) {
    clicked_element.parentElement.remove();
    settings_saved = false;
    document.getElementById("save_button").classList.add("positive");
}



function save() {
    var color_settings_input_groups = document.querySelectorAll("#color_input_groups_container > .input_group");
    var new_colors = {};

    for (let input_group of color_settings_input_groups) {
        var label = input_group.getElementsByTagName("label")[0];
        var input = input_group.getElementsByTagName("input")[0];

        new_colors[label.innerText] = input.value;
    }

    config.data.colors = new_colors;

    config.save_data(config.data);
    alert("Color settings have been saved. Changes will take effect after page refresh.");

    settings_saved = true;
    document.getElementById("save_button").classList.remove("positive");
}
