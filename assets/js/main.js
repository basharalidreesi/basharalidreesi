"use strict";

const bashar = {

	lexicon: {
		header: document.getElementById("header"),
		svg: document.getElementById("headerSVG"),
		fStop: document.getElementById("fStop"),
		sStop: document.getElementById("sStop"),
		sparkleZone: document.getElementById("sparkleZone"),
		sparkle: document.getElementById("sparkle"),
		switches: document.querySelectorAll("switch"),

		works: document.querySelectorAll(".workIndex__work"),
	},

	initAllScripts: function() {
		bashar.header.initHeaderScripts();
		bashar.main.initMainScripts();
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
			}, { passive: true });
		},
		reportCursorY: function(clampedCursorYRatio) {
			bashar.header.opacifyStops(clampedCursorYRatio);
			bashar.header.offsetStops(clampedCursorYRatio);
			bashar.header.shiftSparkleZone(clampedCursorYRatio);
		},
		opacifyStops: function(clampedCursorYRatio) {
			let opacificationRate = bashar.util.parabola(-4, clampedCursorYRatio, -0.5, 1);
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
			let validationZones = document.querySelectorAll("#headerMain > g > *");
			let validationPoint = bashar.lexicon.svg.createSVGPoint();
			validationPoint.x = sparkleX;
			validationPoint.y = sparkleY;
			validationZones.forEach((validationZone) => {
				if (validationZone.isPointInFill(validationPoint)) {
					validSparkle = true;
				}
			});
			if (!validSparkle) { return; }
			bashar.header.acceptSparkle(sparkleX, sparkleY, clampedCursorYRatio);
		},
		acceptSparkle: function(sparkleX, sparkleY, clampedCursorYRatio) {
			let opacity = bashar.util.parabola(-4, clampedCursorYRatio, -0.5, 1);
			var scale = bashar.util.clamp(
				0,
				bashar.util.randomFloatBetween(opacity - 0.25, opacity + 0.25),
				1.25
			);
			if (bashar.util.queryMedia("(max-width: 768px)")) {
				scale = scale * 1.5;
			}
			bashar.lexicon.sparkle.setAttribute("fill-opacity", opacity);
			bashar.lexicon.sparkle.setAttribute("stroke-opacity", opacity);
			if(clampedCursorYRatio >= 1 || clampedCursorYRatio <= 0) { return; }
			bashar.lexicon.sparkle.setAttribute(
				"transform",
					"translate(" + sparkleX + ", " + sparkleY + ")"
					+ " scale(" + scale + ")"
					+ " rotate(45)"
			);
		},
	},

	main: {
		initMainScripts: function() {
			window.addEventListener("load", () => {
				bashar.main.workIndex.resizeWorks();
			});
			window.addEventListener("resize", () => {
				bashar.main.workIndex.resizeWorks();
			});
		},
		workIndex: {
			resizeWorks: function() {
				let fontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("font-size"));
				let gridRowHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--number-index-grid-rows")) * fontSize;
				let gridGapHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--number-index-grid-gaps")) * fontSize;
				bashar.lexicon.works.forEach((work) => {
					let workDl = work.querySelector(":scope dl");
					let workDlHeight = workDl.getBoundingClientRect().height;
					let workDlSpan = Math.ceil((workDlHeight + gridGapHeight) / (gridRowHeight + gridGapHeight));
					work.style.setProperty("--number-index-grid-row-spans", workDlSpan);
				});
			},
		},
	},

	util: {
		dTimer: 0,
		debounce: function(callback, delay) {
			clearTimeout(bashar.util.dTimer);
			return bashar.util.dTimer = setTimeout(callback, delay);
		},
		tTimer: 0,
		throttle: function(callback, delay) {
			if (bashar.util.tTimer) { return; }
			return bashar.util.tTimer = setTimeout(() => {
				if (callback) {
					callback();
				}
				bashar.util.tTimer = 0;
			}, delay);
		},
		clamp: function(min, number, max) {
			return Math.max(min, Math.min(number, max));
		},
		parabola: function(a, x, b, c) {
			/* https://www.desmos.com/calculator */
			return a * (x + b) ** 2 + c;
		},
		randomIntBetween: function(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min) + min);
		},
		randomFloatBetween: function(min, max) {
			return Math.random() * (max - min) + min;
		},
		deviceCanHover: window.matchMedia("(any-hover: hover)").matches,
		queryMedia: function(query) {
			return window.matchMedia(query).matches;
		},
	},

}

bashar.initAllScripts();
