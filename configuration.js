var config = {
	timetable: [
		{
			day: "Montag",
			schedule: [
				{subject: "Physik", room: 321},
				{subject: "Erdkunde", room:304},
				{subject: "Deutsch", room: 329},
				{subject: "Bili", room: 304},
				{subject: "Biologie", room:113},
				{subject: "Informatik", room:312}, 
				{subject: "", room: ""},
				{subject: "Mathe", room:329},
				{subject: "Musik", room:211},
				{subject: "", room: ""}
			]
		},

		{
			day: "Dienstag",
			schedule: [
				{subject: "Informatik", room: 312},
				{subject: "Deutsch", room: 208},
				{subject: "Mathe", room: 207},
				{subject: "", room: ""},
				{subject: "Englisch", room: 222},
				{subject: "Englisch", room: 222},
				{subject: "Musik",  room: 211},
				{subject: "", room: ""},
				{subject: "", room: ""},
				{subject: "", room: ""}
			]
		},

		{
			day: "Mittwoch",
			schedule: [
				{subject: "Erdkunde", room:306},
				{subject: "Religion", room:209},
				{subject: "Englisch", room:203},
				{subject: "Mathe", room:111},
				{subject: "Biologie", room:113},
				{subject: "Physik", room:321},
				{subject: "", room: ""},
				{subject: "", room: ""},
				{subject: "", room: ""},
				{subject: "", room: ""}
			]
		},

		{
			day: "Donnerstag",
			schedule: [
				{subject: "Physik", room:321},
				{subject: "Bili", room:304},
				{subject: "Informatik", room:312},
				{subject: "Informatik", room:312},
				{subject: "Englisch", room:312},
				{subject: "", room:""},
				{subject: "Musik", room:214},
				{subject: "Religion", room:315},
				{subject: "", room: ""},
				{subject: "", room: ""}
			]
		},

		{
			day: "Freitag",
			schedule: [
				{subject: "Physik", room:321},
				{subject: "Physik", room:321},
				{subject: "Deutsch", room:206},
				{subject: "Biologie", room:113},
				{subject: "Informatik", room:216},
				{subject: "Englisch", room:217},
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
		Bili:			"#520",
		Biologie: 		"#373",
		Deutsch:		"#05A",
		Englisch: 		"#F80",
		Informatik:		"#477",
		Mathe: 			"#092",
		Musik: 			"#D22",
		Physik: 		"#08F",
		Religion: 		"#A0D",
		Erdkunde:		"#FC0",
		Sport: 			"#222",	
	}
};
/*var timetable = [
	{
		day: "Montag",
		schedule: [
			{subject: "Physik", room: 321},
			{subject: "Erdkunde", room:304},
			{subject: "Deutsch", room: 329},
			{subject: "Bili", room: 304},
			{subject: "Biologie", room:113},
			{subject: "Informatik", room:312}, 
			{subject: "", room: ""},
			{subject: "Mathe", room:329},
			{subject: "Musik", room:211},
			{subject: "", room: ""}
		]
	},

	{
		day: "Dienstag",
		schedule: [
			{subject: "Informatik", room: 312},
			{subject: "Deutsch", room: 208},
			{subject: "Mathe", room: 207},
			{subject: "", room: ""},
			{subject: "Englisch", room: 222},
			{subject: "Englisch", room: 222},
			{subject: "Musik",  room: 211},
			{subject: "", room: ""},
			{subject: "", room: ""},
			{subject: "", room: ""}
		]
	},

	{
		day: "Mittwoch",
		schedule: [
			{subject: "Erdkunde", room:306},
			{subject: "Religion", room:209},
			{subject: "Englisch", room:203},
			{subject: "Mathe", room:111},
			{subject: "Biologie", room:113},
			{subject: "Physik", room:321},
			{subject: "", room: ""},
			{subject: "", room: ""},
			{subject: "", room: ""},
			{subject: "", room: ""}
		]
	},
	
	{
		day: "Donnerstag",
		schedule: [
			{subject: "Physik", room:321},
			{subject: "Bili", room:304},
			{subject: "Informatik", room:312},
			{subject: "Informatik", room:312},
			{subject: "Englisch", room:312},
			{subject: "", room:""},
			{subject: "Musik", room:214},
			{subject: "Religion", room:315},
			{subject: "", room: ""},
			{subject: "", room: ""}
		]
	},
	
	{
		day: "Freitag",
		schedule: [
			{subject: "Physik", room:321},
			{subject: "Physik", room:321},
			{subject: "Deutsch", room:206},
			{subject: "Biologie", room:113},
			{subject: "Informatik", room:216},
			{subject: "Englisch", room:217},
			{subject: "Sport", room:"SHG"},
			{subject: "Sport", room:"SHG"},
			{subject: "", room: ""},
			{subject: "", room: ""}
		]
	}
];





var periods = [
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
];





var colors = {
	Bili:			"#520",
	Biologie: 		"#373",
	Deutsch:		"#05A",
	Englisch: 		"#F80",
	Informatik:		"#477",
	Mathe: 			"#092",
	Musik: 			"#D22",
	Physik: 		"#08F",
	Religion: 		"#A0D",
	Erdkunde:		"#FC0",
	Sport: 			"#222",
};
*/
