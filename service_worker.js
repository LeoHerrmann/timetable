self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch_and_cache(event.request);
        })
    );
});



function fetch_and_cache(url) {
    return fetch(url).then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return caches.open("timetable_cache_1").then(function(cache) {
            cache.put(url, response.clone());
            return response;
        });
    })
    .catch(function(error) {
        console.log("Request failed:", error);
    });
}



self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open("timetable_cache_1").then(function(cache) {
            return cache.addAll([
                "./",
                "./application_settings.html",
                "./color_settings.html",
                "./icon.png",
                "./index.html",
                "./manifest.json",
                "./periods_settings.html",
                "./settings.html",
                "./timetable_settings.html",
                "./scripts/application_settings.js",
                "./scripts/color_settings.js",
                "./scripts/configuration.js",
                "./scripts/general.js",
                "./scripts/page_transitions.js",
                "./scripts/periods_settings.js",
                "./scripts/script.js",
                "./scripts/timetable_settings.js",
                "./scripts/translator.js",
                "./styles/general.css",
                "./styles/index.css",
                "./styles/settings.css",
                "./styles/settings_pages.css",
                "./styles/fontello/css/fontello.css",
                "./styles/fontello/font/fontello.eot",
                "./styles/fontello/font/fontello.svg",
                "./styles/fontello/font/fontello.ttf",
                "./styles/fontello/font/fontello.woff",
                "./styles/fontello/font/fontello.woff2",
                "./styles/Montserrat/Montserrat-Bold.ttf",
                "./styles/Montserrat/Montserrat-Medium.ttf"
            ]);
        })
    );
});
