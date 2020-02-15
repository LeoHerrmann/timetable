window.onload = function() {
	fill_periods_container();
	create_day_containers();



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
			document.getElementById("timetable").append(new_day_container);

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

				new_day_container.append(new_subject_container);
			}
		}
	}
};





function get_subject_color(subject) {
	var subject_hue = config.data.colors[subject];

	if (typeof(subject_hue) == "undefined") {
		subject_hue = "0";
	}

    if (config.data.dark_mode_enabled) {
		return `hsl(${subject_hue}, 90%, 70%)`;
	}
	else {
		return `hsl(${subject_hue}, 100%, 35%)`;
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
		var start_time = clicked_period.getElementsByTagName("span")[0].innerText;
		var end_time = clicked_period.getElementsByTagName("span")[1].innerText;
		var period_index;
		var period_number;

		var neighbours = document.getElementById("periods_container").childNodes;

		for (let n in neighbours) {
			if (clicked_period == neighbours[n]) {
				period_index = n;
				period_number = parseInt(n) + 1;
			}
		}

		document.querySelector("#periods_edit_popup .period_number_label").innerText = translator.translate("period") + " " + period_number;
		document.querySelector("#periods_edit_popup .period_number_label").setAttribute("data-period-index", period_index);
		document.querySelector("[name='period_start_input']").value = start_time;
		document.querySelector("[name='period_end_input']").value = end_time;

		popup.show("periods_edit_popup");
	},



	save_period_changes: function() {
		var period_index = document.querySelector("#periods_edit_popup .period_number_label").getAttribute("data-period-index");
		var start_time = document.querySelector("[name='period_start_input']").value;
		var end_time = document.querySelector("[name='period_end_input']").value;

		var new_data = JSON.parse(JSON.stringify(config.data));

		new_data.periods[period_index].start = start_time;
		new_data.periods[period_index].end = end_time;

		config.save_data(new_data);
		config.load_data();

		var period_labels = document.querySelectorAll(`#periods_container > .period:nth-of-type(${parseInt(period_index) + 1}) span`);
		period_labels[0].innerText = start_time;
		period_labels[1].innerText = end_time;
	}
};
