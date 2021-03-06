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

    for (let subject in config.data.colors) {
        let hue = config.data.colors[subject];

        color_input_groups_container.innerHTML +=
            "<div class='input_group'>" +
                `<label>${subject}</label>` +
                `<input type='range' min='0' max='360' value='${hue}'/>` +
                `<div class="color_preview" style="background-color: hsl(${hue}, 100%, 50%)"></div>` +
                `<button onclick="remove_color(this);" class="icon-delete"></button>`
            "</div>";
    }

    var inputs = document.getElementsByTagName("input");
    for (input_element of inputs) {
        input_element.onchange = function(e) {
            settings_saved = false;
            document.getElementById("save_button").classList.add("positive");
            e.target.parentElement.getElementsByClassName("color_preview")[0].style.backgroundColor = `hsl(${e.target.value}, 100%, 50%)`;
        }
    }

    //nur die Farben löschbar machen, die nicht um Stundenplan sind
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
        console.log(input.value);
    }

    config.data.colors = new_colors;

    config.save_data(config.data);
    alert("Color settings have been saved. Changes will take effect after page refresh.");

    settings_saved = true;
    document.getElementById("save_button").classList.remove("positive");
}
