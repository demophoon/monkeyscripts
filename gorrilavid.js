// ==UserScript==
// @name         gorillavid auto submit form
// @namespace    http://github.com/demophoon/monkeyscripts
// @version      0.2
// @description  Automatically skip annoying ad popup and auto play source video
// @author       Britt Gresham
// @match        http://gorillavid.tld/*
// @match        http://daclips.tld/*
// @grant        none
// ==/UserScript==

//window.onbeforeunload = function(){
 //   return 'Are you sure you want to leave?';
//};

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
