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
            "language: ": "Language:",
            "save": "Save",
            "general": "General",
            "backup": "Backup",
            "restore": "Restore",
            "reset": "Reset",
            "colors": "Colors",
            "periods": "Periods"
        },
        
        de: {
            "timetable": "Stundenplan",
            "settings": "Einstellungen",
            "language: ": "Sprache:",
            "save": "Speichern",
            "general": "Allgemein",
            "backup": "Backup",
            "restore": "Wiederherstellen",
            "reset": "Zurücksetzen",
            "colors": "Farben",
            "periods": "Zeiten"
        }
    }
}
