window.onload = function() {
	dom_setup();
	add_navigation_events();
	timetable.display_current();

	register_service_worker();



	function dom_setup() {
		create_header_buttons();
		fill_periods_container();
		create_subject_divs();


		function create_header_buttons() {
			var header = document.getElementsByTagName("header")[0];
			var counter = 0;

			for (entry of config.data.timetable) {
				var new_button = document.createElement("button");

				new_button.innerText = entry.day.substring(0,2);
				new_button.setAttribute("data-dayNumber", counter);


				new_button.addEventListener("click", function(e) {
					var header_buttons = document.querySelectorAll("header > button");

					for (button of header_buttons) {
						button.classList.remove("open");
					}

					e.target.classList.add("open");

					timetable.display_for_day(e.target.getAttribute("data-dayNumber"));
				});

				header.appendChild(new_button);
				counter++;
			}
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
			});
		}


		function create_subject_divs() {
			var subjectsContainer = document.getElementById("subjects_container");

			for (let i = 0; i < config.data.periods.length; i++) {
				var subjectDiv = document.createElement("div");

				subjectDiv.classList.add("subject");
				subjectDiv.classList.add("hidden");
				subjectDiv.style.transitionDelay = i*0.025 + "s";

				subjectDiv.innerHTML = "<span></span><span></span>";

				subjectDiv.addEventListener("contextmenu", function(e) {
				    e.preventDefault();

					var clicked_subject_div = e.target;

				    if (e.target.classList.contains("subject") === false) {
				    	clicked_subject_div = e.target.closest(".subject");
				    }

				    editor.show_schedule_edit_popup(clicked_subject_div);
				});

				subjectsContainer.appendChild(subjectDiv);
			}
		}
	}



	function add_navigation_events() {
		add_swipe_events();
		add_keyboard_events();


		function add_swipe_events() {
			var timetable_div = document.getElementById("timetable");

			timetable_div.ontouchstart = function(e_start) {
				var touch_start_position = e_start.touches[0].clientX;

				timetable_div.ontouchmove = function(e_end) {
					var touch_end_position = e_end.touches[0].clientX;

					if (touch_start_position < touch_end_position - 75) {
						timetable_div.ontouchmove = null;
						timetable.display_previous_day();
					}
					else if (touch_start_position > touch_end_position + 75) {
						timetable_div.ontouchmove = null;
						timetable.display_next_day();
					}
				};
			};
		}


		function add_keyboard_events() {
			window.addEventListener("keydown", function(e) {
				if (e.keyCode == 37) {
					timetable.display_previous_day();
				}
				else if (e.keyCode == 39) {
					timetable.display_next_day();
				}
			});
		}
	}



	function register_service_worker() {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.register("service_worker.js");
		}
	}
};



var timetable = {
	currently_shown_day_number: 0,

	display_for_day: function(dayNumber) {
		timetable.currently_shown_day_number = dayNumber;

		timetable.subject_divs.hide();

		setTimeout(function() {
			timetable.subject_divs.fill(dayNumber);
			timetable.subject_divs.show();
		}, 450);
	},


	display_current: function() {
		var d = new Date();
		dayNumber = (d.getDay() != 0) ? d.getDay() - 1 : 6;

		var header_buttons = document.querySelectorAll("header > button");

		if (dayNumber >= config.data.timetable.length) {
			header_buttons[0].classList.add("open");
			timetable.display_for_day(0);
		}
		else {
			header_buttons[dayNumber].classList.add("open");
			timetable.display_for_day(dayNumber);
		}
	},


	display_previous_day: function() {
		var previous_day_number;
		var header_buttons = document.querySelectorAll("header > button");

		if (timetable.currently_shown_day_number != 0) {
			previous_day_number = parseInt(timetable.currently_shown_day_number) - 1;
			header_buttons[previous_day_number].click();
		}
	},


	display_next_day: function() {
		var next_day_number;
		var header_buttons = document.querySelectorAll("header > button");

		if (timetable.currently_shown_day_number != config.data.timetable.length - 1) {
			next_day_number = parseInt(timetable.currently_shown_day_number) + 1;
			header_buttons[next_day_number].click();
		}
	},


	subject_divs: {
		fill: function (dayNumber) {
			var subject_divs = document.querySelectorAll(".subject");

			for (let period = 0; period < config.data.timetable[dayNumber].schedule.length && period < config.data.periods.length; period++) {
				var subject_name = config.data.timetable[dayNumber].schedule[period].subject;
				var subject_room = config.data.timetable[dayNumber].schedule[period].room;

				if (subject_name != "") {
					subject_divs[period].classList.remove("empty");

					var subject_hue = config.data.colors[subject_name];

					if (typeof(subject_hue) == "undefined") {
					    subject_hue = "0";
					}

                    if (config.data.dark_mode_enabled) {
						subject_divs[period].style.color = `hsl(${subject_hue}, 90%, 70%)`;
					}
					else {
						subject_divs[period].style.color = `hsl(${subject_hue}, 100%, 35%)`;
					}

					subject_divs[period].querySelectorAll("span")[0].innerText = subject_name;
					subject_divs[period].querySelectorAll("span")[1].innerText = subject_room;
				}
				else {
					subject_divs[period].classList.add("empty");
				}
			}
		},

		show: function() {
			var subject_divs = document.querySelectorAll(".subject");

			for (div of subject_divs) {
				div.classList.remove("hidden");
			}
		},


		hide: function() {
			var subject_divs = document.querySelectorAll(".subject");

			for (div of subject_divs) {
				div.classList.add("hidden");
			}
		}
	},


	refresh_periods_container: function() {
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
};





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
		var day_index = timetable.currently_shown_day_number;

		var period_index;
		var neighbours = document.getElementById("subjects_container").childNodes;

		for (n in neighbours) {
			if (clicked_subject_div == neighbours[n]) {
				period_index = n;
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
		timetable.display_for_day(timetable.currently_shown_day_number);
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

		timetable.refresh_periods_container();
	}
};
