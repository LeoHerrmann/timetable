var translator = {
    translate: function() {
        var elements_to_translate = document.querySelectorAll("[data-translate]");
        
        for (element of elements_to_translate) {
            element.innerText = translator.languages[config.language][element.getAttribute("data-translate")];
        }
    },

    languages: {
        en: {
            "timetable": "Timetable"
        },
        
        de: {
            "timetable": "Stundenplan"
        }
    }
}
