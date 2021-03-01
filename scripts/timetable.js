var refresh_periods_container = function() {
	var periods_container = document.getElementById("periods_container");

	periods_container.onclick = function(e) {
		e.preventDefault();
	};

	periods_container.innerHTML = "";

	if (config.data.periods.length == 0) {
		periods_container.innerHTML =
			"<div class='no_period_placeholder' onclick='editor.show_period_edit_popup();'>+</div>";
	}

	for (period of config.data.periods) {
		periods_container.innerHTML += 
			"<div class='period' onclick='editor.show_period_edit_popup();'>" +
				`<span>${period.start}</span>` +
				`<span>${period.end}</span>` +
			"</div>";
	}
};


function add_color_input_events() {
    var color_input = document.querySelector("[name='color_input']");
	var subject_input = document.querySelector("[name='subject_input']");

    color_input.addEventListener("input", function(e) {
        var color = e.target.value;

        var color_preview = document.getElementsByClassName("color_preview")[0].style.backgroundColor = `hsl(${color}, 100%, 50%)`;
    });

	subject_input.addEventListener("input", function(e) {
		var subject = e.target.value;
		var color = config.data.colors[subject];

		if (color === undefined) {color = 0};

		document.querySelector("[name='color_input']").value = color;
		document.getElementsByClassName("color_preview")[0].style.backgroundColor = `hsl(${color}, 100%, 50%)`;
	});
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
};



var editor = {
	show_period_edit_popup: function() {
		var periods = config.data.periods;

		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");

		periods_edit_inputs_container.innerHTML = "";

		for (let i = 0; i < periods.length; i++) {
			let period_id = i + 1;

		    let period_label = document.createElement("span");
		    let input_start = document.createElement("input");
		    let input_end = document.createElement("input");
		    let delete_button = document.createElement("button");

			period_label.setAttribute("data-period-id", period_id);
			period_label.innerText = period_id;

			input_start.classList.add("period_start_input");
			input_start.setAttribute("type", "time");
			input_start.setAttribute("data-period-id", period_id);
			input_start.value = periods[i].start;

			input_end.classList.add("period_end_input");
			input_end.setAttribute("type", "time");
			input_end.setAttribute("data-period-id", period_id);
			input_end.value = periods[i].end;

			delete_button.classList.add("icon-delete");
			delete_button.setAttribute("data-period-id", period_id);
			delete_button.setAttribute("onclick", `editor.delete_period(${period_id});`);

			periods_edit_inputs_container.appendChild(period_label);
			periods_edit_inputs_container.appendChild(input_start);
			periods_edit_inputs_container.appendChild(input_end);
			periods_edit_inputs_container.appendChild(delete_button);
		}

		popup.show("periods_edit_popup");
	},



	add_period: function() {
		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");

		var period_number = periods_edit_inputs_container.childElementCount / 4 + 1;

        let period_label = document.createElement("span");
        let input_start = document.createElement("input");
        let input_end = document.createElement("input");
        let delete_button = document.createElement("button");

		period_label.setAttribute("data-period-id", period_number);
		period_label.innerText = period_number;

		input_start.classList.add("period_start_input");
		input_start.setAttribute("type", "time");
		input_start.setAttribute("data-period-id", period_number);

		input_end.classList.add("period_end_input");
		input_end.setAttribute("type", "time");
		input_end.setAttribute("data-period-id", period_number);

		delete_button.classList.add("icon-delete");
		delete_button.setAttribute("data-period-id", period_number);
		delete_button.setAttribute("onclick", `editor.delete_period(${period_number});`);

		periods_edit_inputs_container.appendChild(period_label);
		periods_edit_inputs_container.appendChild(input_start);
		periods_edit_inputs_container.appendChild(input_end);
		periods_edit_inputs_container.appendChild(delete_button);
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
		var new_config = JSON.parse(JSON.stringify(config.data));
		var new_period_config = [];

		var periods_edit_inputs_container = document.getElementById("periods_edit_inputs_container");
		var period_start_inputs = periods_edit_inputs_container.getElementsByClassName("period_start_input");
		var period_end_inputs = periods_edit_inputs_container.getElementsByClassName("period_end_input");
		var periods_count = periods_edit_inputs_container.childElementCount / 4;
		var old_periods_count = config.data.periods.length;

		for (let i = 0; i < periods_count; i++) {
			new_period_config.push({
				"start": period_start_inputs[i].value,
				"end": period_end_inputs[i].value, 
			});
		}

		new_config.periods = new_period_config;


		//modify schedule if there are more or less periods than before
		if (periods_count > old_periods_count) {
			for (let i = 0; i < (periods_count - old_periods_count); i++) {
				for (let j = 0; j < new_config.timetable.length; j++) {
					new_config.timetable[j].schedule.push({
						"subject": "",
						"room": ""
					});
				}
			}
		}

		else if (periods_count < old_periods_count) {
			for (let i = 0; i < (old_periods_count - periods_count); i++) {
				for (let j = 0; j < new_config.timetable.length; j++) {
					new_config.timetable[j].schedule.pop();
				}
			}
		}


		config.save_data(new_config);
		config.load_data();

		refresh_periods_container();
		refresh_schedule_container();
	}
};
