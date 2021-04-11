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
                                let cursorYRatio = (cursorYPos - headerOffsetTop) / headerHeight;
                                let cursorYPercent = parseInt(cursorYRatio * 100) + "%";
                                bashar.header.reportCursorY(cursorYRatio, cursorYPercent);
                        });
                },
                reportCursorY: function(cursorYRatio, cursorYPercent) {
                        bashar.header.opacifyCentralStop(cursorYRatio);
                        bashar.header.offsetCentralStop(cursorYPercent);
                },
                opacifyCentralStop: function(cursorYRatio) {
                        console.log(cursorYRatio);
                        // do something
                },
                offsetCentralStop: function(cursorYPercent) {
                        bashar.lexicon.centralStop.setAttribute("offset", cursorYPercent);
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
