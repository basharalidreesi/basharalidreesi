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
			bashar.header.trackScroll();
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
			let opacificationRate = bashar.util.parabola(-4, clampedCursorYRatio, -0.5, 1);
			let scalingRate = bashar.util.clamp(
				0,
				bashar.util.randomFloatBetween(opacificationRate - 0.25, opacificationRate + 0.25),
				1.25
			);
			bashar.lexicon.sparkle.setAttribute("fill-opacity", opacificationRate);
			bashar.lexicon.sparkle.setAttribute("stroke-opacity", opacificationRate);
			if(clampedCursorYRatio >= 1 || clampedCursorYRatio <= 0) { return; }
			bashar.lexicon.sparkle.setAttribute(
				"transform",
					"translate(" + sparkleX + ", " + sparkleY + ")"
					+ " scale(" + scalingRate + ")"
					+ " rotate(45)"
			);
		},
		trackScroll: function() {
			window.addEventListener("scroll", () => {
				if (bashar.util.deviceCanHover) { return; }
				bashar.header.proposeFlare();
			});
		},
		proposeFlare: function() {
			let minFlareRangeX = 0;
			let maxFlareRangeX = parseFloat(bashar.lexicon.svg.getAttribute("width"));
			let minFlareRangeY = 0;
			let maxFlareRangeY = parseFloat(bashar.lexicon.svg.getAttribute("height"));
			let flareX = bashar.util.randomIntBetween(minFlareRangeX, maxFlareRangeX);
			let flareY = bashar.util.randomIntBetween(minFlareRangeY, maxFlareRangeY);
			bashar.header.validateFlare(flareX, flareY);
		},
		validateFlare: function(flareX, flareY) {
			let validFlare = false;
			let validationZones = document.querySelectorAll("#headerMain > g > *");
			let validationPoint = bashar.lexicon.svg.createSVGPoint();
			validationPoint.x = flareX;
			validationPoint.y = flareY;
			validationZones.forEach((validationZone) => {
				if (validationZone.isPointInFill(validationPoint)) {
					validFlare = true;
				}
			});
			if (!validFlare) { return; }
			bashar.header.acceptFlare(flareX, flareY);
		},
		acceptFlare: function(flareX, flareY) {
			let intensity = bashar.util.randomFloatBetween(0.25, 1);
			bashar.lexicon.sparkle.setAttribute("fill-opacity", intensity);
			bashar.lexicon.sparkle.setAttribute("stroke-opacity", intensity);
			bashar.lexicon.sparkle.setAttribute(
				"transform",
					"translate(" + flareX + ", " + flareY + ")"
					+ " scale(" + intensity + ")"
					+ " rotate(45)"
			);
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
		debug: false,
	},

}

bashar.initAllScripts();
