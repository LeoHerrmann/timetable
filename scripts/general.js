window.addEventListener("DOMContentLoaded", function() {
    config.load_data();
    translator.translate_ui();

    if (config.data.dark_mode_enabled) {
        document.body.classList.add("dark_mode");
        document.head.querySelector("[name='theme-color']").setAttribute("content", "#222");
    }
});
