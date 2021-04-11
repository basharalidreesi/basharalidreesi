"use strict";

var bashar = {

        lexicon: {
                body: document.body,
                        header: document.getElementById("header"),
                                headerGradient: document.getElementById("headerGradient"),
                                headerGradientCentralStop: document.getElementById("headerGradientCentralStop"),
                        nav: document.getElementById("nav"),
                        main: document.getElementById("main"),
                        footer: document.getElementById("footer")
        },

        init: function() {
                bashar.initHeader();
        },

        initHeader: function() {
                bashar.trackCursorPosWithinHeader();
        },

        trackCursorPosWithinHeader: function() {
                window.addEventListener("mousemove", (event) => {
                        let cursorPos = parseInt(event.pageY / bashar.lexicon.header.offsetHeight * 100);
                        bashar.updateHeaderGradientCentralStop(cursorPos);
                });
        },

        updateHeaderGradientCentralStop: function(cursorPos) {
                bashar.lexicon.headerGradientCentralStop.setAttribute("offset", cursorPos + "%");
        },
}

bashar.init();
