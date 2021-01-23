refresh_periods_container = function() {
	var periods_container = document.getElementById("periods_container");

	periods_container.innerHTML = "";

	for (period of config.data.periods) {
		periods_container.innerHTML += 
			"<div class='period' oncontextmenu='editor.show_period_edit_popup();'>" +
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
};



var editor = {
	show_period_edit_popup: function() {
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
