"use strict";

const bashar = {

        lexicon: {
                header: document.getElementById("header"),
                svg: document.getElementById("headerSVG"),
                fStop: document.getElementById("fStop"),
                sStop: document.getElementById("sStop"),
                sparkleZone: document.getElementById("sparkleZone"),
                sparkle: document.getElementById("sparkle"),
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
                        bashar.header.opacifyStops(clampedCursorYRatio);
                        bashar.header.offsetStops(clampedCursorYRatio);
                        bashar.header.shiftSparkleZone(clampedCursorYRatio);
                },
                opacifyStops: function(clampedCursorYRatio) {
                        let opacificationRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.fStop.setAttribute("stop-opacity", opacificationRate);
                        bashar.lexicon.sStop.setAttribute("stop-opacity", opacificationRate);
                },
                offsetStops: function(clampedCursorYRatio) {
                        let offsettingRate = parseInt(clampedCursorYRatio * 100) + "%";
                        bashar.lexicon.fStop.setAttribute("offset", offsettingRate);
                        bashar.lexicon.sStop.setAttribute("offset", offsettingRate);
                },
                shiftSparkleZone: function(clampedCursorYRatio) {
                        let sparkleZoneHalfHeight = parseFloat(bashar.lexicon.sparkleZone.getAttribute("height")) / 2;
                        let shiftingRate = parseInt(clampedCursorYRatio * 100) - sparkleZoneHalfHeight + "%";
                        bashar.lexicon.sparkleZone.setAttribute("y", shiftingRate);
                        bashar.header.proposeSparkle(clampedCursorYRatio);
                },
                proposeSparkle: function(clampedCursorYRatio) {
                        let minSparkleRangeX =
                                parseFloat(bashar.lexicon.sparkleZone.getAttribute("x")) / 100
                                * parseFloat(bashar.lexicon.svg.getAttribute("width"));
                        let maxSparkleRangeX =
                                parseFloat(bashar.lexicon.sparkleZone.getAttribute("width")) / 100
                                * parseFloat(bashar.lexicon.svg.getAttribute("width"))
                                + minSparkleRangeX;
                        let minSparkleRangeY =
                                parseFloat(bashar.lexicon.sparkleZone.getAttribute("y")) / 100
                                * parseFloat(bashar.lexicon.svg.getAttribute("height"));
                        let maxSparkleRangeY =
                                parseFloat(bashar.lexicon.sparkleZone.getAttribute("height")) / 100
                                * parseFloat(bashar.lexicon.svg.getAttribute("height"))
                                + minSparkleRangeY;
                        let sparkleX = bashar.util.randomIntBetween(minSparkleRangeX, maxSparkleRangeX);
                        let sparkleY = bashar.util.randomIntBetween(minSparkleRangeY, maxSparkleRangeY);
                        bashar.header.validateSparkle(sparkleX, sparkleY, clampedCursorYRatio);
                },
                validateSparkle: function(sparkleX, sparkleY, clampedCursorYRatio) {
                        let validSparkle = false;
                        let validationZones = document.querySelectorAll("path");
                        validationZones.forEach((validationZone) => {
                                if (validationZone.isPointInFill(new DOMPoint(sparkleX, sparkleY))) {
                                        validSparkle = true;
                                }
                        });
                        if (!validSparkle) { return; }
                        bashar.header.acceptSparkle(sparkleX, sparkleY, clampedCursorYRatio);
                },
                acceptSparkle: function(sparkleX, sparkleY, clampedCursorYRatio) {
                        // bashar.lexicon.sparkle.setAttribute("x", sparkleX);
                        // bashar.lexicon.sparkle.setAttribute("y", sparkleY);
                        bashar.lexicon.sparkle.setAttribute("transform", "translate(" + (sparkleX - bashar.lexion.sparkle.getBoundingClientRect().width / 2) + ", " + (sparkleY - bashar.lexion.sparkle.getBoundingClientRect().height / 2) + ") scale(0.2, 0.2)");
                        let opacificationRate = -4 * ((clampedCursorYRatio - 0.5) ** 2) + 1;
                        bashar.lexicon.sparkle.setAttribute("fill-opacity", opacificationRate);
                        bashar.lexicon.sparkle.setAttribute("stroke-opacity", opacificationRate);
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
                randomIntBetween: function(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min) + min);
                },
                deviceCanHover: window.matchMedia("(any-hover: hover)").matches,
                debug: false,
        },

}

bashar.initAllScripts();
