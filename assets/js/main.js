"use strict";

const bashar = {

        lexicon: {
                header: document.getElementById("header"),
                svg: document.getElementById("headerSVG"),
                headerGroup: document.getElementById("headerGroup"),
                fStop: document.getElementById("fStop"),
                sStop: document.getElementById("sStop"),
                sparkleArea: document.getElementById("sparkleArea"),
                headerSparkles: document.getElementById("headerSparkles"),
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
                        if (clampedCursorYRatio >= 1 || clampedCursorYRatio <= 0) { return; }
                        bashar.header.shiftSparkleArea(clampedCursorYRatio);
                        bashar.header.situateSparkle(clampedCursorYRatio);
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
                shiftSparkleArea: function(clampedCursorYRatio) {
                        let sparkleAreaHalfHeight = parseFloat(bashar.lexicon.sparkleArea.getAttribute("height")) / 2;
                        let shiftingRate = parseInt(clampedCursorYRatio * 100) - sparkleAreaHalfHeight + "%";
                        bashar.lexicon.sparkleArea.setAttribute("y", shiftingRate);
                },
                situateSparkle: function(clampedCursorYRatio) {
                        let sparkleX = parseInt(Math.random() * 100) + "%";
                        let sparkleY = parseInt(clampedCursorYRatio * 100) + "%";
                        bashar.header.validateSparkle(sparkleX, sparkleY);
                        bashar.header.generateSparkle(sparkleX, sparkleY);
                },
                validateSparkle: function(sparkleX, sparkleY) {
                        let xPos = parseFloat(sparkleX);
                        let yPos = parseFloat(sparkleY);
                        let elementAtPoint = document.elementFromPoint(xPos, yPos);
                        console.log(elementAtPoint);
                        if (elementAtPoint === "path") {
                                return true;
                        }
                        return false;
                },
                generateSparkle: function(sparkleX, sparkleY) {
                        const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        point.setAttribute("fill", "white");
                        point.setAttribute("r", "5");
                        point.setAttribute("cx", sparkleX);
                        point.setAttribute("cy", sparkleY);
                        bashar.lexicon.headerSparkles.appendChild(point);
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
