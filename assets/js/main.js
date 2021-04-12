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
                                if (!bashar.util.deviceCanHover) { return; }
                                let cursorYPos = event.clientY;
                                let headerOffsetTop = bashar.lexicon.header.getBoundingClientRect().top;
                                let headerHeight = bashar.lexicon.header.clientHeight;
                                let cursorYRatio = (cursorYPos - headerOffsetTop) / headerHeight;
                                let clampedCursorYRatio = bashar.util.clamp(0, cursorYRatio, 1);
                                bashar.header.reportCursorY(clampedCursorYRatio);
                        });
                },
                reportCursorY: function(clampedCursorYRatio) {
                        bashar.header.opacifyStop(clampedCursorYRatio);
                        bashar.header.offsetStop(clampedCursorYRatio);
                },
                opacifyStop: function(clampedCursorYRatio) {
                        let opacificationRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.cStop.setAttribute("stop-opacity", opacificationRate);
                },
                offsetStop: function(clampedCursorYRatio) {
                        let offsettingRate = parseInt(clampedCursorYRatio * 100) + "%";
                        bashar.lexicon.cStop.setAttribute("offset", offsettingRate);
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
                deviceCanHover: window.matchMedia("(any-hover: hover)").matches,
        },

}

bashar.initAllScripts();
