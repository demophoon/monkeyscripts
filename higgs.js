// ==UserScript==
// @name         Higgs auto-installer
// @namespace    https://github.com/demophoon/monkeyscripts
// @version      0.1
// @description  Auto PE Installer using Higgs
// @author       Britt Gresham
// @match        https://localhost:3000/*
// @match        https://master.vm:3000/*
// @match        https://*.master.vm:3000/*
// @match        https://*.delivery.puppetlabs.net:3000/*
// @match        https://master.vm/*
// @match        https://*.master.vm/*
// @match        https://*.delivery.puppetlabs.net/*
// @grant        none
// ==/UserScript==

window._pe_install_options = {
    higgs_hostname: document.location.hostname,
    higgs_port: "3000",
    console_username: 'admin',
    console_password: 'puppetlabs',
    console_email: 'admin@puppetlabs.com', # For <3.3

    master_host_username: 'vagrant',
    master_host_password: 'vagrant',
    master_hostname: 'master.vm',
    puppetdb_hostname: 'puppetdb.vm',
    console_hostname: 'console.vm',
}

if (document.location.port == window._pe_install_options.higgs_port) {
    switch (document.location.pathname) {
        case '/':
            $(document).ready(function() {
                window.startAutoInstall = function() {
                    localStorage.autoInstall=true;
                    setTimeout(function() { document.location.pathname="/type"; }, 50);
                }
                localStorage.autoInstall = false;
                $('.splash').append('<a href="#" style="opacity: .5" onmousedown="startAutoInstall()">Auto-Install</a>');
            });
            break;
        case '/interview/monolithic':
            $(document).ready(function() {
                if (document.location.hostname.match(/vm/) || document.location.hostname != window._pe_install_options.master_hostname) {
                    // Remote Install
                    $('#master_install_location_remote').click();
                    $('#master_host_username, #master_ssh_username, #master_sudo_password').val(_pe_install_options.master_host_username);
                } else {
                    // Local Install
                }
                // Common Items
                $('#master_hostname').val(_pe_install_options.master_hostname);
                $('#console_username').val(_pe_install_options.console_email);
                $('#console_password').val(_pe_install_options.console_password);
                $('#smtp_hostname').val('localhost');
            });
            break;
        case '/interview/split':
            $(document).ready(function() {
                // Remote Install
                $('#master_install_location_remote').click();
                $('#master_host_username, #master_ssh_username, #master_sudo_password').val(_pe_install_options.master_host_username);
                $('#puppetdb_host_username, #puppetdb_ssh_username, #puppetdb_sudo_password').val(_pe_install_options.master_host_username);
                $('#console_host_username, #console_ssh_username, #console_sudo_password').val(_pe_install_options.master_host_password);
                $('#master_hostname').val(_pe_install_options.master_hostname);
                $('#puppetdb_hostname').val(_pe_install_options.puppetdb_hostname);
                $('#console_hostname').val(_pe_install_options.console_hostname);
                $('#console_username').val('admin@puppetlabs.net');
                $('#console_password').val(_pe_install_options.console_password);
                $('#smtp_hostname').val('localhost');

            });
            break;
    }
    if (localStorage.autoInstall == 'true') {
        switch (document.location.pathname) {
            case '/type':
                document.location.pathname = '/interview/monolithic';
                break;
            case '/interview/monolithic':
                $(document).ready(function() {
                    if (document.location.hostname.match(/vm/)) {
                        $('#master_install_location_remote').click();
                        $('#master_host_username, #master_sudo_password').val(_pe_install_options.master_host_username);
                        $('#master_hostname').val(_pe_install_options.master_hostname);
                        $('#console_password').val(_pe_install_options.console_password);
                    } else {
                        $('#master_hostname').val(_pe_install_options.master_hostname);
                        $('#console_password').val(_pe_install_options.console_password);
                    }
                    $('#submit-btn').click();
                });
                break;
            case '/summary':
            case '/validate':
                $(document).ready(function() {
                    document.location.pathname = '/deploy';
                });
                break;
            case '/deploy':
                $(document).ready(function() {
                    var x = setInterval(function() {
                        if ($("#get-started-btn").css("display") != 'none') {
                            clearInterval(x);
                            if (localStorage.autoInstall == 'true') {
                                localStorage.autoInstall = false;
                                document.location.href = 'https://' + _pe_install_options.master_hostname;
                            };
                        }
                    }, 500);
                });
                break;
            default:
                localStorage.autoInstall = false;
                break;
        };
    }
} else {
    switch (window.location.pathname) {
        case '/cas/login':
            $("#username").val(_pe_install_options.console_email);
            $("#password").val(_pe_install_options.console_password);
            $("#login").submit();
        break;
        case '/auth/login':
            $(document).ready(function() {
                $("#username").val(_pe_install_options.console_username);
                $("#password").val(_pe_install_options.console_password);
                $("#loginForm").submit();
            });
        break;
    }
}
