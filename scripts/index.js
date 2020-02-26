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
			})
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
