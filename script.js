window.onload = function() {
	create_header_buttons();
	fill_periods_container();
	create_subject_divs();
	show_current_timetable();
	add_swipe_events();



	function create_header_buttons() {
		var header = document.getElementsByTagName("header")[0];
		var counter = 0;
		
		
		for (entry of config.timetable) {
			var newButton = document.createElement("button");
			
			newButton.innerText = entry.day.substring(0,2);
			newButton.setAttribute("data-dayNumber", counter);
			
			
			newButton.addEventListener("click", function(e) {
				var headerButtons = document.querySelectorAll("header > button");
			
				for (button of headerButtons) {
					button.classList.remove("open");
				}

				e.target.classList.add("open");

				timetable.display_for_day(e.target.getAttribute("data-dayNumber"));
			});
			
			
			header.append(newButton);
			counter++;
		}
	}



	function fill_periods_container() {
		for (period of config.periods) {
			var periodDiv = document.createElement("div");
			var startSpan = document.createElement("span");
			var endSpan = document.createElement("span");

			startSpan.innerText = period.start;
			endSpan.innerText = period.end;

			periodDiv.append(startSpan, endSpan);
			periodDiv.classList.add("period");
			document.getElementById("periods_container").append(periodDiv);
		}
	}



	function create_subject_divs() {
		var subjectsContainer = document.getElementById("subjects_container");

		for (let i = 0; i < config.periods.length; i++) {
			var subjectDiv = document.createElement("div");

			subjectDiv.classList.add("subject");
			subjectDiv.classList.add("hidden");
			subjectDiv.style.transitionDelay = i*0.025 + "s";

			subjectNameSpan	= document.createElement("span");
			subjectRoomSpan	= document.createElement("span");
			subjectDiv.append(subjectNameSpan);
			subjectDiv.append(subjectRoomSpan);

			subjectsContainer.append(subjectDiv);
		}
	}



	function show_current_timetable() {
		var d = new Date();
		dayNumber = (d.getDay() != 0) ? d.getDay() - 1 : 6;

		var headerButtons = document.querySelectorAll("header > button");

		if (dayNumber >= config.timetable.length) {
			headerButtons[0].classList.add("open");
			timetable.display_for_day(0);
		}
		else {
			headerButtons[dayNumber].classList.add("open");
			timetable.display_for_day(dayNumber);
		}
	}
	
	
	
	function add_swipe_events() {
		var timetable_div = document.getElementById("timetable");
	
		timetable_div.ontouchstart = function(e_start) {
			var touch_start_position = e_start.touches[0].clientX;

			timetable_div.ontouchmove = function(e_end) {
				var touch_end_position = e_end.touches[0].clientX;

				if (touch_start_position < touch_end_position - 75) {
					timetable_div.ontouchmove = null;
					timetable.display_next_day();
				}
				else if (touch_start_position > touch_end_position + 75) {
					timetable_div.ontouchmove = null;
					timetable.display_previous_day();
				}
			};
		};
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
	
	
	display_previous_day: function() {
		var previous_day_number;
		var headerButtons = document.querySelectorAll("header > button");
		
		if (timetable.currently_shown_day_number != 0) {
			previous_day_number = parseInt(timetable.currently_shown_day_number) - 1;
			headerButtons[previous_day_number].click();
		}
	},
	
	
	display_next_day: function() {
		var next_day_number;
		var headerButtons = document.querySelectorAll("header > button");
	
		if (timetable.currently_shown_day_number != config.timetable.length - 1) {
			next_day_number = parseInt(timetable.currently_shown_day_number) + 1;
			headerButtons[next_day_number].click();
		}
	},
	
	
	subject_divs: {
		fill: function (dayNumber) {
			var subjectDivs = document.querySelectorAll(".subject");

			for (let period = 0; period < config.timetable[dayNumber].schedule.length; period++) {
				var subjectName = config.timetable[dayNumber].schedule[period].subject;
				var subjectRoom = config.timetable[dayNumber].schedule[period].room;

				if (subjectName != "") {
					subjectDivs[period].classList.remove("empty");

					subjectDivs[period].style.color = config.colors[subjectName];

					subjectDivs[period].querySelectorAll("span")[0].innerText = subjectName;
					subjectDivs[period].querySelectorAll("span")[1].innerText = subjectRoom;
				}
				else {
					subjectDivs[period].classList.add("empty");
				}
			}
		},
		
		
		show: function() {
			var subjectDivs = document.querySelectorAll(".subject");

			for (div of subjectDivs) {
				div.classList.remove("hidden");
			}
		},
		
		
		hide: function() {
			var subjectDivs = document.querySelectorAll(".subject");

			for (div of subjectDivs) {
				div.classList.add("hidden");
			}
		}
	}
};
