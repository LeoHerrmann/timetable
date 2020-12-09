var printing_mode = false;



window.onload = function() {
    if (window.location.href.split("?")[1] == "print") {
    	printing_mode = true;
    }

	fill_periods_container();
	create_day_containers();

    if (printing_mode === true) {
		document.body.classList.remove("dark_mode")

        setTimeout(function() {
        	window.print();
        }, 1000);
    }



	function fill_periods_container() {
		var periods_container = document.getElementById("periods_container");

		for (period of config.data.periods) {
			periods_container.innerHTML += 
				"<div class='period' oncontextmenu='editor.show_period_edit_popup(this);'>" +
					`<span>${period.start}</span>` +
					`<span>${period.end}</span>` +
				"</div>";
		}

		periods_container.addEventListener("contextmenu", function(e) {
			e.preventDefault();
		})
	}



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
				new_subject_container.innerHTML =
					`<span>${period.subject}</span>` +
					`<span>${period.room}</span>`;

				new_subject_container.oncontextmenu = function(e) {
					e.preventDefault();

					if (e.target.classList.contains("subject_container")) {
						editor.show_schedule_edit_popup(e.target);
					}
					else {
						editor.show_schedule_edit_popup(e.target.closest(".subject_container"));
					}
				};

				if (period.subject == "") {
					new_subject_container.classList.add("empty");
				}

				new_subject_container.style.color = get_subject_color(period.subject);

				new_day_container.appendChild(new_subject_container);
			}
		}
	}
};





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





refresh_periods_container  = function() {
	var periods_container = document.getElementById("periods_container");

	periods_container.innerHTML = "";

	for (period of config.data.periods) {
		periods_container.innerHTML += 
			"<div class='period' oncontextmenu='editor.show_period_edit_popup(this);'>" +
				`<span>${period.start}</span>` +
				`<span>${period.end}</span>` +
			"</div>";
	}
}




var popup = {
	close: function() {
		var popups = document.getElementsByClassName("popup");
		var overlay = document.getElementsByClassName("overlay")[0];

		for (var popup of popups) {
			popup.style.opacity = "0";
		}

		overlay.style.opacity = "0";

		setTimeout(function() {
			for (var popup of popups) {
				popup.style.display = "none";
			}

			overlay.style.display = "none";
		}, 200)
	},

	show: function(id) {
		var popup = document.getElementById(id); 
		var overlay = document.getElementsByClassName("overlay")[0];
		popup.style.opacity = "1";
		overlay.style.opacity = "1";
		popup.style.display = "block";
		document.getElementsByClassName("overlay")[0].style.display = "block";
	}
}






var editor = {
	show_schedule_edit_popup: function(clicked_subject_div) {
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
	},



	save_schedule_changes: function() {
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
	},



	show_period_edit_popup: function(clicked_period) {
		var periods = config.data.periods;

		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");

		periods_edit_inputs_container.innerHTML = "";

		for (let i = 0; i < periods.length; i++) {
			let period_id = i + 1;

			let period_label = `<span data-period-id="${period_id}">${period_id}</span>`;
			let inputs = 
				`<input class="period_start_input" type="time" value="${periods[i].start}" data-period-id="${period_id}"/>` +
				`<input class="period_end_input" type="time" value="${periods[i].end}" data-period-id="${period_id}"/>`

			let delete_button = `<button class='icon-delete' data-period-id="${period_id}" onclick="editor.delete_period(${period_id});"></button>`;

			periods_edit_inputs_container.innerHTML += period_label + inputs + delete_button;
		}

		popup.show("periods_edit_popup");
	},



	add_period: function() {
		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");

		var period_number = periods_edit_inputs_container.childElementCount / 4 + 1;

		let period_label = `<span data-period-id="${period_number}">${period_number}</span>`;
		let inputs = 
			`<input class="period_start_input" type="time" data-period-id="${period_number}"/>` +
			`<input class="period_end_input" type="time" data-period-id="${period_number}"/>`

		let delete_button = `<button class='icon-delete' data-period-id="${period_number}" onclick="editor.delete_period(${period_number});"></button>`;

		periods_edit_inputs_container.innerHTML += period_label + inputs + delete_button;
	},



	delete_period: function(id) {
		var elements_to_delete = document.querySelectorAll(`#periods_edit_inputs_container [data-period-id="${id}"]`);

		for (let element of elements_to_delete) {
			element.remove();
		}

		//refresh period ids
		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");

		for (let i = 0; i < periods_edit_inputs_container.childElementCount; i++) {
			periods_edit_inputs_container.childNodes[i].setAttribute("data-period-id", Math.floor(i / 4) + 1);
		}

		//refresh period labels and delete buttons
		var period_labels = document.querySelectorAll("#periods_edit_inputs_container > span");
		var delete_buttons = document.querySelectorAll("#periods_edit_inputs_container > .icon-delete");

		for (let i = 0; i < period_labels.length; i++) {
			period_labels[i].innerText = i + 1;
			delete_buttons[i].setAttribute("onclick", `editor.delete_period(${i + 1})`);
		}
	},



	save_period_changes: function() {
		var new_period_config = [];

		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");
		var period_start_inputs = periods_edit_inputs_container.getElementsByClassName("period_start_input");
		var period_end_inputs = periods_edit_inputs_container.getElementsByClassName("period_end_input");
		var periods_count = periods_edit_inputs_container.childElementCount / 4;

		for (let i = 0; i < periods_count; i++) {
			new_period_config.push({
				"start": period_start_inputs[i].value,
				"end": period_end_inputs[i].value, 
			});
		}

		var new_config = JSON.parse(JSON.stringify(config.data));

		new_config.periods = new_period_config;

		config.save_data(new_config);
		config.load_data();

		refresh_periods_container();
	}
};
