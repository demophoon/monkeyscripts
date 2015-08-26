// ==UserScript==
// @name         Video Player auto submit form
// @namespace    http://github.com/demophoon/monkeyscripts
// @version      0.3
// @description  Automatically skip annoying ad popups and auto play source video on various websites
// @author       Britt Gresham
// @match        http://gorillavid.tld/*
// @match        http://daclips.tld/*
// @match        http://www.promptfile.tld/*
// @grant        none
// ==/UserScript==

function match_any_re(needle, regexes) {
    for (regex in regexes) {
        re = regexes[regex];
        if (needle.match(re)) {
            return true;
        }
    }
    return false;
}

var hostname = document.location.hostname;

if (match_any_re(hostname, [
    'gorillavid\..*',
    'daclips\..*',
])) {
    
    window.onload = function() {
        var submit_form = false;
        if (typeof(countDown) == "function") {
            setInterval(countDown, 1);
            setTimeout(function() { document.getElementsByTagName('form')[1].submit(); }, 15);
        } else {
            flashvars_elements = document.getElementsByName('flashvars');
            if (flashvars_elements.length == 0) {
                return;
            }
            flashvar_strings = flashvars_elements[0].value.split('&');
            var flashvars = {};
            for(var x in flashvar_strings) {
                flashvar = flashvar_strings[x].split('=');
                flashvars[flashvar[0]] = flashvar[1];
            }
            document.location.href = decodeURIComponent(flashvars['file']) + "?autoplay=true"
        }
    };
} else if (match_any_re(hostname, [
    'promptfile\..*',
])) {
    
    window.onload = function() {
        forms = document.getElementsByTagName('form');
        if (forms.length > 0) {
            forms[0].submit();
        }
        document.getElementById('continue_btn').click();
        setTimeout(function() {
            // We don't actually want to download from this site since 
            // we cannot accurately detect whether or not the link is
            // playable in a web browser or not...
            return;

            var flashvars_elements = document.getElementsByName('flashvars');
            flashvar_strings = flashvars_elements[0].value.split('&');
            var flashvars = {};
            for(var x in flashvar_strings) {
                flashvar = flashvar_strings[x].split('=');
                flashvars[flashvar[0]] = flashvar[1];
            }
            config = JSON.parse(flashvars['config']);
            document.location.href = decodeURIComponent(config['playlist'][0]['url']);
        }, 25);
    };
}
