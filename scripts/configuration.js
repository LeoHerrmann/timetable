var config = {
	load_data: function() {
		data = localStorage.getItem("config_data");

		if (data != null) {
			try {
				config.data = JSON.parse(data);
			}
			catch (SyntaxError) {
				alert("Error: Wrong data structure!");
			}
		}
	},

	save_data: function(new_data) {
		localStorage.setItem("config_data", JSON.stringify(new_data));
	},

	reset_data: function() {
		localStorage.removeItem("config_data");
	},

	data: {
		language: "en",

		dark_mode_enabled: false,

        hints_disabled: false,

		timetable: [
			{
				day: "monday",
				schedule: []
			},
			{
				day: "tuesday",
				schedule: []
			},
			{
				day: "wednesday",
				schedule: []
			},
			{
				day: "thursday",
				schedule: []
			},
			{
				day: "friday",
				schedule: []
			}
		],

		periods: [],

		colors: {}

		/*timetable: [
			{
				day: "Monday",
				schedule: [
					{subject: "Physics", room: 321},
					{subject: "Geography", room:304},
					{subject: "German", room: 329},
					{subject: "History", room: 304},
					{subject: "Biology", room: 113},
					{subject: "Computer Science", room:312}, 
					{subject: "", room: ""},
					{subject: "Maths", room:329},
					{subject: "Music", room:211},
					{subject: "", room: ""}
				]
			},

			{
				day: "Tuesday",
				schedule: [
					{subject: "Computer Science", room: 312},
					{subject: "German", room: 208},
					{subject: "Maths", room: 207},
					{subject: "", room: ""},
					{subject: "English", room: 222},
					{subject: "English", room: 222},
					{subject: "Music",  room: 211},
					{subject: "", room: ""},
					{subject: "", room: ""},
					{subject: "", room: ""}
				]
			},

			{
				day: "Wednesday",
				schedule: [
					{subject: "Geography", room:306},
					{subject: "Religion", room:209},
					{subject: "English", room:203},
					{subject: "Maths", room:111},
					{subject: "Biology", room:113},
					{subject: "Physics", room:321},
					{subject: "", room: ""},
					{subject: "", room: ""},
					{subject: "", room: ""},
					{subject: "", room: ""}
				]
			},

			{
				day: "Thursday",
				schedule: [
					{subject: "Physics", room:321},
					{subject: "History", room:304},
					{subject: "Computer Science", room:312},
					{subject: "Computer Science", room:312},
					{subject: "English", room:312},
					{subject: "", room:""},
					{subject: "Music", room:214},
					{subject: "Religion", room:315},
					{subject: "", room: ""},
					{subject: "", room: ""}
				]
			},

			{
				day: "Friday",
				schedule: [
					{subject: "Physics", room:321},
					{subject: "Physics", room:321},
					{subject: "German", room:206},
					{subject: "Biology", room:113},
					{subject: "Computer Science", room:216},
					{subject: "English", room:217},
					{subject: "Sport", room:"SHG"},
					{subject: "Sport", room:"SHG"},
					{subject: "", room: ""},
					{subject: "", room: ""}
				]
			}
		],



		periods: [
			{start: "07:50", end: "08:35"},
			{start: "08:40", end: "09:25"},
			{start: "09:40", end: "10:25"},
			{start: "10:30", end: "11:15"},
			{start: "11:30", end: "12:15"},
			{start: "12:15", end: "13:00"},
			{start: "13:15", end: "14:00"},
			{start: "14:00", end: "14:45"},
			{start: "14:45", end: "15:30"},
			{start: "15:30", end: "16:15"}
		],



		colors: {
			"Physics":"179",
			"English":"38",
			"Biology":"82",
			"German":"208",
			"Maths":"134",
			"Music":"0",
			"History":"21",
			"Religion":"282",
			"Geography":"56",
			"Computer Science":"326",
			"Sport":"251"
		}*/
	}
};
