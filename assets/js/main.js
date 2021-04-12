"use strict";

const bashar = {

        lexicon: {
                body: document.body,
                header: document.getElementById("header"),
                cStop: document.getElementById("cStop"),
                nav: document.getElementById("nav"),
                main: document.getElementById("main"),
                footer: document.getElementById("footer"),
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
                        bashar.header.opacifyStop(cursorYRatio);
                        bashar.header.offsetStop(cursorYPercent);
                },
                opacifyStop: function(cursorYRatio) {
                        let clampedCursorYRatio = bashar.util.clamp(0, cursorYRatio, 1);
                        let opacifyRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.cStop.setAttribute("stop-opacity", opacifyRate);
                },
                offsetStop: function(cursorYPercent) {
                        bashar.lexicon.cStop.setAttribute("offset", cursorYPercent);
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
