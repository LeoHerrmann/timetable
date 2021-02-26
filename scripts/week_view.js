var printing_mode = false;



window.onload = function() {
    if (window.location.href.split("?")[1] == "print") {
    	printing_mode = true;
    }

	refresh_periods_container();
	create_day_containers();

    if (printing_mode === true) {
		document.body.classList.remove("dark_mode")

        setTimeout(function() {
        	window.print();
        }, 1000);
    }
};



function create_day_containers() {
	var timetable = config.data.timetable;

	for (let day_index = 0; day_index < timetable.length; day_index++) {
		var new_day_container = document.createElement("div");
		new_day_container.classList.add("day_container");
		document.getElementById("timetable").appendChild(new_day_container);

		new_day_container.innerHTML = `<div class='day_label'>${timetable[day_index].day}</div>`;

		for (period of timetable[day_index].schedule) {
			new_subject_container = document.createElement("div");
			new_subject_container.classList.add("subject_container");

            if (period.subject == "" && period.room == "") {
            	new_subject_container.innerHTML =
    				`<span>+</span>` +
    				`<span></span>`;

    			new_subject_container.style.color = "";
    			new_subject_container.classList.add("empty");
    			
				if (config.data.hints_disabled === true) {
					new_subject_container.style.opacity = 0;
				}
            }

            else {
                new_subject_container.innerHTML =
    				`<span>${period.subject}</span>` +
    				`<span>${period.room}</span>`;

    			new_subject_container.style.color = get_subject_color(period.subject);
            }

			new_subject_container.onclick = function(e) {
				e.preventDefault();

				if (e.target.classList.contains("subject_container")) {
					editor.show_schedule_edit_popup(e.target);
				}
				else {
					editor.show_schedule_edit_popup(e.target.closest(".subject_container"));
				}
			};

			new_day_container.appendChild(new_subject_container);
		}
	}
}



function refresh_schedule_container() {
    var day_containers = document.getElementsByClassName("day_container");

	while (day_containers.length > 0) {
		day_containers[0].remove();
	}

    create_day_containers();
}



function get_subject_color(subject) {
	var subject_hue = config.data.colors[subject];

	if (typeof(subject_hue) == "undefined") {
		subject_hue = "0";
	}

    if (config.data.dark_mode_enabled && printing_mode === false) {
		return `hsl(${subject_hue}, 90%, 70%)`;
	}
	else {
		return `hsl(${subject_hue}, 100%, 35%)`;
	}
}



editor.show_schedule_edit_popup = function(clicked_subject_div) {
	var day_container = clicked_subject_div.closest(".day_container");

	var day_index;
	var day_containers = document.getElementsByClassName("day_container");

	for (let i in day_containers) {
		if (day_container == day_containers[i]) {
			day_index = i;
		}
	}


	var period_index;
	var subject_containers = day_container.getElementsByClassName("subject_container");

	for (container in subject_containers) {
		if (clicked_subject_div == subject_containers[container]) {
			period_index = container;
		}
	}


	var day_name = config.data.timetable[day_index].day;

	var subject = config.data.timetable[day_index].schedule[period_index].subject;
	var room = config.data.timetable[day_index].schedule[period_index].room;

	document.getElementById("day_label").innerText = day_name + ",";
	document.getElementById("day_label").setAttribute("data-day-index", day_index);
	document.querySelector("#schedule_edit_popup .period_number_label").innerText = translator.translate("period") + " " + (parseInt(period_index) + 1);
	document.querySelector("#schedule_edit_popup .period_number_label").setAttribute("data-period-index", period_index);
	document.querySelector("[name='subject_input']").value = subject;
	document.querySelector("[name='room_input']").value = room;

	popup.show("schedule_edit_popup");
}



editor.save_schedule_changes = function() {
	var day_index = document.getElementById("day_label").getAttribute("data-day-index");
	var period_index = document.querySelector("#schedule_edit_popup .period_number_label").getAttribute("data-period-index");
	var subject = document.querySelector("[name='subject_input']").value;
	var room = document.querySelector("[name='room_input']").value;

	var new_data = JSON.parse(JSON.stringify(config.data));

	new_data.timetable[day_index].schedule[period_index].subject = subject;
	new_data.timetable[day_index].schedule[period_index].room = room;

	config.save_data(new_data);
	config.load_data();

	var day_container = document.getElementsByClassName("day_container")[day_index];
	subject_container = day_container.getElementsByClassName("subject_container")[period_index];
	subject_container.innerHTML = `<span>${subject}</span>` + `<span>${room}</span`;

	subject_container.style.color = get_subject_color(subject);

	refresh_schedule_container();
}
