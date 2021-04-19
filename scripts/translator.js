var translator = {
    translate: function(key) {
        var translation = translator.languages[config.data.language][key];
        return translation;
    },

    translate_ui: function() {
        document.getElementsByTagName("html")[0].setAttribute("lang", config.data.language);

        var elements_to_translate = document.querySelectorAll("[data-translator-key]");

        for (element of elements_to_translate) {
            element.innerText = translator.translate(element.getAttribute("data-translator-key"));
        }
    },

    languages: {
        en: {
            "settings": "Settings",
            "language: ": "Language:",
            "dark_mode: ": "Dark mode:",
            "save": "Save",
            "cancel": "Cancel",
            "disable_hints:": "Disable hints:",
            "edit_schedule": "Edit schedule",
            "edit_periods": "Edit periods",
            "application": "Application",
            "backup": "Backup",
            "restore": "Restore",
            "reset": "Reset",
            "subject:": "Subject:",
            "room:": "Room:",
            "color:": "Color:",
            "manage_colors": "Manage colors",
            "about_timetable": "About Timetable",
            "periods": "Periods",
            "period": "Period",
            "print": "Print",
            "start:": "Start:",
            "end:": "End:",
            "add": "Add",
            "data_saved": "Your application data was successfully saved.",
            "reset_confirm": "Are you sure to reset all data? If you haven't made a backup, all application data will be lost forever.",
            "monday": "Monday",
            "tuesday": "Tuesday",
            "wednesday": "Wednesday",
            "thursday": "Thursday",
            "friday": "Friday"
        },

        de: {
            "settings": "Einstellungen",
            "language: ": "Sprache:",
            "dark_mode: ": "Dark mode:",
            "save": "Speichern",
            "cancel": "Abbrechen",
            "disable_hints:": "Hinweise verstecken:",
            "edit_schedule": "Stundenplan bearbeiten",
            "edit_periods": "Zeiten bearbeiten",
            "application": "Anwendung",
            "backup": "Sichern",
            "restore": "Wiederherstellen",
            "reset": "Zurücksetzen",
            "subject:": "Fach:",
            "room:": "Raum:",
            "color:": "Farbe:",
            "manage_colors": "Farben verwalten",
            "about_timetable": "Über Timetable",
            "periods": "Zeiten",
            "period": "Stunde",
            "print": "Drucken",
            "start:": "Anfang:",
            "end:": "Ende:",
            "add": "Hinzufügen",
            "data_saved": "Ihre Anwendungsdaten wurden erfolgreich gespeichert.",
            "reset_confirm": "Sind Sie sich sicher, dass sie alle Anwendungsdaten zurücksetzen wollen? Wenn Sie kein Backup gemacht haben, gehen dadurch alle Anwendungsdaten für immer verloren.",
            "monday": "Montag",
            "tuesday": "Dienstag",
            "wednesday": "Mittwoch",
            "thursday": "Donnerstag",
            "friday": "Freitag"
        }
    }
};
