var translator = {
    translate: function() {
        var elements_to_translate = document.querySelectorAll("[data-translate]");
        
        for (element of elements_to_translate) {
            element.innerText = translator.languages[config.data.language][element.getAttribute("data-translate")];
        }
    },

    languages: {
        en: {
            "timetable": "Timetable",
            "settings": "Settings",
            "language: ": "Language: ",
            "save": "Save"
        },
        
        de: {
            "timetable": "Stundenplan",
            "settings": "Einstellungen",
            "language: ": "Sprache: ",
            "save": "Save"
        }
    }
}
