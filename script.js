window.onload = function() {
	create_header_buttons();
	fill_periods_container();
	create_subject_divs();
	show_current_timetable();

	setTimeout(function() {
		show_subject_divs();
	}, 200);



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

				hide_subject_divs();

				setTimeout(function() {
					show_subject_divs();
					fill_subject_divs(e.target.getAttribute("data-dayNumber"));
				}, 450);
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
			fill_subject_divs(0);
		}
		else {
			headerButtons[dayNumber].classList.add("open");
			fill_subject_divs(dayNumber);
		}
	}
};




function fill_subject_divs(dayNumber) {
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
}



function hide_subject_divs() {
	var subjectDivs = document.querySelectorAll(".subject");

	for (div of subjectDivs) {
		div.classList.add("hidden");
	}
}

function show_subject_divs() {
	var subjectDivs = document.querySelectorAll(".subject");

	for (div of subjectDivs) {
		div.classList.remove("hidden");
	}
}
