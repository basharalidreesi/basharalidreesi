"use strict";

const bashar = {

        lexicon: {
                body: document.body,
                header: document.getElementById("header"),
                        headerHeight: header.clientHeight,
                        headerOffsetTop: header.getBoundingClientRect().top,
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
                        bashar.header.keepHeaderHeightCurrent();
                },
                trackCursorY: function() {
                        window.addEventListener("mousemove", (event) => {
                                let cursorYPos = event.clientY;
                                let cursorYPercent = parseInt(((cursorYPos - bashar.lexicon.headerOffsetTop) / bashar.lexicon.headerHeight) * 100) + "%";
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
                keepHeaderHeightCurrent: function() {
                        window.addEventListener("resize", () => {
                                bashar.util.debounce(() => {
                                        bashar.lexicon.header.headerHeight = bashar.lexicon.header.clientHeight;
                                }, 250);
                        })
                }
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
