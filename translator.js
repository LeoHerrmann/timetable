var translator = {
    translate: function(key) {
        var translation = translator.languages[config.data.language][key];
        return translation;
    },
    
    translate_ui: function() {
        var elements_to_translate = document.querySelectorAll("[data-translator-key]");
        
        for (element of elements_to_translate) {
            element.innerText = translator.translate(element.getAttribute("data-translator-key"));
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
