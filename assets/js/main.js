"use strict";

const bashar = {

        lexicon: {
                body: document.body,
                header: document.getElementById("header"),
                        headerHeight: bashar.lexicon.header.clientHeight,
                        headerOffsetTop: bashar.lexicon.header.getBoundingClientRect().top,
                centralStop: document.getElementById("headerGradientCentralStop"),
                nav: document.getElementById("nav"),
                main: document.getElementById("main"),
                footer: document.getElementById("footer")
        },

        initAllScripts: function() {
                bashar.header.initHeaderScripts();
        },

        header: {
                initHeaderScripts: function() {
                        bashar.header.trackCursorY();
                },
                trackCursorY: function() {
                        window.addEventListener("mousemove", (event) => {
                                let cursorYPos = event.clientY;
                                let cursorYPercent = parseInt(cursorYPos / (headerHeight - headerOffsetTop) * 100) + "%";
                                bashar.header.transferCursorY(cursorYPercent);
                        });
                },
                transferCursorY: function(cursorYPercent) {
                        bashar.header.offsetCentralStop(cursorYPercent);
                        bashar.header.opacifyCentralStop(cursorYPercent);
                },
                offsetCentralStop: function(cursorYPercent) {
                        bashar.lexicon.centralStop.setAttribute("offset", cursorYPercent);
                },
                opacifyCentralStop: function(cursorYPercent) {
                        // do something
                },
        },

}

bashar.initAllScripts();
