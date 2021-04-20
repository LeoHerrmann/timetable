var printing_mode = false;



window.onload = function() {
    if (window.location.href.split("?")[1] == "print") {
    	printing_mode = true;
    }

	refresh_periods_container();
	create_day_containers();
	add_color_input_events();

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

		new_day_container.innerHTML = `<div class='day_label'>${translator.translate(timetable[day_index].day)}</div>`;

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
				var period_index;
				var clicked_subject_div;
				var day_container;

				if (e.target.classList.contains("subject_container")) {
					clicked_subject_div = e.target;
					day_container = clicked_subject_div.closest(".day_container");
				}

				else {
					clicked_subject_div = e.target.closest(".subject_container");
					day_container = clicked_subject_div.closest(".day_container");
				}

				var subject_containers = day_container.getElementsByClassName("subject_container");

				for (let container in subject_containers) {
					if (clicked_subject_div == subject_containers[container]) {
						period_index = container;
					}
				}

				editor.show_schedule_edit_popup(day_index, period_index);
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
