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
    show_periods_options();


    function show_periods_options() {
        var periods_settings_group = document.getElementById("periods_settings_group");
        var add_input_group_button = document.createElement("button");

        add_input_group_button.innerText = translator.translate("add");
        add_input_group_button.onclick = function() {
            add_input_group("", "");
            settings_saved = false;
            document.getElementById("save_button").classList.add("positive");
        };

        periods_settings_group.appendChild(add_input_group_button);

        for (period of config.data.periods) {
            add_input_group(period.start, period.end);
        }

        function add_input_group(start, end) {
            var periods_input_groups_container = document.getElementById("periods_input_groups_container");

            periods_input_groups_container.innerHTML += 
                "<div class='input_group'>" + 
                    `<input type='time' value='${start}'/>` +
                    `<input type='time' value='${end}'/>` +
                    "<button class='icon-delete negative' onclick='this.parentElement.remove(); settings_saved=false; document.getElementById(&quot;save_button&quot;).classList.add(&quot;positive&quot;);' aria-label='Delete'></button>" +
                "</div>";

            var inputs = document.getElementsByTagName("input");
            for (input_element of inputs) {
                input_element.onchange = function() {
                    settings_saved = false;
                    document.getElementById("save_button").classList.add("positive");
                }
            }
        }
    }
}


function save() {
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

    settings_saved = true;
    document.getElementById("save_button").classList.remove("positive");
}
