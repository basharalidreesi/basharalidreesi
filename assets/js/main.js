"use strict";

const bashar = {

        lexicon: {
                body: document.body,
                header: document.getElementById("header"),
                fStop: document.getElementById("fStop"),
                bStop: document.getElementById("bStop"),
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
                        bashar.header.opacifyGradientStops(cursorYRatio);
                        bashar.header.offsetGradientStops(cursorYPercent);
                },
                opacifyGradientStops: function(cursorYRatio) {
                        let clampedCursorYRatio = bashar.util.clamp(0, cursorYRatio, 1);
                        let opacifyRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.fStop.setAttribute("stop-opacity", opacifyRate);
                },
                offsetGradientStops: function(cursorYPercent) {
                        bashar.lexicon.fStop.setAttribute("offset", cursorYPercent);
                        bashar.lexicon.bStop.setAttribute("offset", cursorYPercent);
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
