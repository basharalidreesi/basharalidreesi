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
                        let clampedCursorYRatio = bashar.util.clamp(0, cursorYRatio, 1);
                        let opacifyRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.centralStop.setAttribute("stop-opacity", opacifyRate);
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
                clamp: function(min, number, max) {
                        return Math.max(min, Math.min(number, max));
                },
        },
}

bashar.initAllScripts();
