function transition_to_page(relative_url) {
    document.body.style.opacity = 0;

    setTimeout(function() {
        var current_url = window.location.href;
        var current_url_directory = current_url.substring(0, current_url.lastIndexOf("/"));
        var next_url = current_url_directory + "/" + relative_url;

        window.location = next_url;
    }, 200);
}


window.addEventListener("pageshow", function() {
    setTimeout(function() {
        document.body.style.opacity = 1;
    }, 200);
});


window.addEventListener("beforeunload", function() {
    console.log("ungeladen");

    var transition_overlay = document.body;
    document.body.style.opacity = 0;
});
