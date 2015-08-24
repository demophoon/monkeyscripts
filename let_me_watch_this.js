// ==UserScript==
// @name         Let me watch this auto watcher
// @namespace    http://github.com/demophoon/monkeyscripts
// @version      0.1
// @description  Adds a "Watch now" link to tv links for quick tv watching!
// @author       Britt Gresham
// @match        http://www.letmewatchthis.tld/*
// @grant        none
// ==/UserScript==

var MovieLink = function(link, site, views, rating) {
    var self = this;
    self.link = link;
    self.site = site;
    self.views = views;
    self.rating = rating;

    self.go = function() {
        console.log("Going to '" + self.link + "'");
        document.location.href = self.link;
    }
}

function by(field){
    return function(a, b) {
        if (a[field] > b[field]) {
            return -1;
        } else if (a[field] < b[field]) {
            return 1;
        } else {
            return 0;
        }
    }
}

function match_any_re(regexes, needle) {
    for (regex in regexes) {
        re = regexes[regex];
        if (needle.match(re)) {
            return true;
        }
    }
    return false;
}

function get_links_and_play() {
    console.log("We can start parsing this shit.");

    // Grab all of the movie links from the page and filter out links that
    // are not high quality or are ads.
    var raw_links = $("table.movie_version").filter(function(k,v) {
        v = $(v);
        return v.find('.quality_dvd')[0] != undefined
    });

    // Create movie link objects from the known good links
    var links = raw_links.map(function(index, item) {
        item = $(item);
        var link = item.find(".movie_version_link a").attr('href');
        var site = item.find(".version_host").text().split(';')[1].trim();
        var views = item.find(".version_veiws").text().trim().split(' ')[0] * 1;
        var rating = item.find(".movie_ratings center").text().trim().slice(1).split(' ')[0] * 1;
        return new MovieLink(link, site, views, rating);
    });

    var allowed = [
        'gorillavid\..*',
    ];

    links = links.filter(function() {
        return match_any_re(allowed, this.site);
    });
    links = links.sort(by("views"));
    if (links.length > 0) {
        links[0].go();
    }
    window.links = links;
}

if (match_any_re(['/tvshows/tv/'], window.location.pathname)) {
    $(document).ready(function() {

        if (window.location.pathname.split("&").length <= 1) {
            // We have not yet selected an episode.
            episodes = $('.tv_episode_item');
            episodes.map(function(index, item) {
                item = $(item);
                var link = item.find('a');
                var new_link = $("<a></a>");
                new_link.css('display', 'inline');
                new_link.css('padding', '0px 0px 0px 5px');
                //new_link.text(link.find('.tv_episode_name').text());
                new_link.text(" (Watch now)");
                new_link.mousedown(function() {
                    localStorage.autoplay = true;
                });
                item.find('.tv_episode_name').append(new_link);
            });
            window.episodes = episodes;
            return;
        } else {
            if (localStorage.autoplay == 'true') {
                localStorage.autoplay = false;
                get_links_and_play();
            }
            return;
        }

    });
} else if (match_any_re(['/external.php'], window.location.pathname)) {
    document.location.href = document.getElementById('play_bottom').src;
}
