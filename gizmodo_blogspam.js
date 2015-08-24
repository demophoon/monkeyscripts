// ==UserScript==
// @name         Gizmodo Blogspam Filter
// @namespace    http://github.com/demophoon/monkeyscripts
// @version      0.0.1
// @description  Searches Gizmodo for the actual content instead of displaying their blogspam
// @author       Britt Gresham
// @match        http://*.gizmodo.com/*
// @grant        none
// ==/UserScript==

(function() {

    var debug = false;

    function log(msg) {
        if (debug) {
        console.log(msg);
        }
    }

    var content = document.getElementsByClassName("entry-content")[0];
    var links = content.getElementsByTagName("a");

    var all_links = [];

    for (var i=0; i<links.length; i++) {
        all_links.push(links[i]);
    }
    var video_links = content.getElementsByClassName("youtube");
    for (var i=0; i<video_links.length; i++) {
        var current_link = video_links[i];
        var placeholder = document.createElement('a');
        if (current_link.src.match(/youtu\.?be/)) {
            placeholder.href = "https://youtu.be/" + current_link.dataset.chompId;
        } else if (current_link.src.match(/vimeo/)) {
            placeholder.href = "https://vimeo.com/" + current_link.dataset.chompId;
        }
        if (placeholder.href != "") {
            all_links.push(placeholder);
        }
    }

    log(all_links);

    var final_links = [];
    var filters = [
        'gizmodo',
        'facebook',
        'twitter',
        't\.co',
        'gawker',
        'wikipedia',
        'wiki',
        'online.wsj',
    ];

    var last_resort = [
        "vimeo",
        "youtu\.?be",
    ];

    var yt_regex = RegExp("(?:v=(\\w+)&?)|(?:\\w+$)", "i");

    for (var i=0; i<all_links.length; i+=1) {

        var current_link = all_links[i].href;

        if (!current_link.match(RegExp(filters.join("|"), 'i'))) {
            if (current_link.match(RegExp("youtube", 'i'))) {
                var video_id = all_links[i].search.match(yt_regex);
                if (video_id) {
                    current_link = "https://youtu.be/" + video_id[1];
                }
            } else if (current_link.match(RegExp("youtu\.be", 'i'))) {
                var video_id = all_links[i].pathname.match(yt_regex);
                if (video_id) {
                    current_link = "https://youtu.be/" + video_id[0];
                }
            }
            if (final_links.indexOf(current_link) == -1) {
                final_links.push(current_link);
            }
        }
    }

    if (final_links.length == 1) {
        document.location = final_links[0];
    } else {
        log("Could not determine a final destination.");
        log(final_links);
        log("Attempting to find a final resort link...");
        final_links = [];
        for (var n=0; n<last_resort.length; n++) {
            for (var i=0; i<all_links.length; i++) {
                var current_link = all_links[i];
                if (current_link.href.match(RegExp(last_resort[n], 'i'))) {
                    final_links.push(current_link.href);
                }
            }
        }
        if (final_links.length == 1) {
            document.location = final_links[0];
        } else {
            log("Could not determine final destination with last resort filters.");
            log(final_links);
        }
    }
})();
