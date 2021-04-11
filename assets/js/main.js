"use strict";

const bashar = {

        lexicon: {
                body: document.body,
                header: document.getElementById("header"),
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
                                let headerOffsetTop = bashar.lexicon.header.getBoundingClientRect().top;
                                let headerHeight = bashar.lexicon.header.clientHeight;
                                let cursorYPercent = parseInt((cursorYPos - headerOffsetTop) / headerHeight * 100) + "%";
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

        util: {
                timer: 0,
                debounce: function(callback, delay) {
                        clearTimeout(bashar.util.timer);
        		return bashar.util.timer = setTimeout(callback, delay);
                },
        },
}

bashar.initAllScripts();
