"use strict";

const bashar = {

	lexicon: {

		header: document.querySelector("#header"),
		graphic: document.querySelector("#header__graphic"),
		flStop: document.querySelector("#flStop"),
		stStop: document.querySelector("#stStop"),
		spZone: document.querySelector("#spZone"),
		sparkle: document.querySelector("#sparkle"),

		main: document.querySelector("#main"),
		jsOnly: document.querySelectorAll(".generic--jsOnly"),
		disabledAnchors: document.querySelectorAll(".generic--disabled"),
		numeros: document.querySelectorAll(".indexOfWorks__work__numero"),

		notes: document.querySelectorAll(".note__content"),

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
				if (!bashar.util.queryMedia("(any-hover: hover)")) { return; }
				if (bashar.util.queryMedia("(prefers-reduced-motion: reduce)")) { return; }
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
			bashar.header.shiftSpZone(clampedCursorYRatio);
		},
		opacifyStops: function(clampedCursorYRatio) {
			let opacificationRate = bashar.util.parabola(-4, clampedCursorYRatio, -0.5, 1);
			bashar.lexicon.flStop.setAttribute("stop-opacity", opacificationRate);
			bashar.lexicon.stStop.setAttribute("stop-opacity", opacificationRate);
		},
		offsetStops: function(clampedCursorYRatio) {
			let offsettingRate = parseInt(clampedCursorYRatio * 100) + "%";
			bashar.lexicon.flStop.setAttribute("offset", offsettingRate);
			bashar.lexicon.stStop.setAttribute("offset", offsettingRate);
		},
		shiftSpZone: function(clampedCursorYRatio) {
			let spZoneHalfHeight = parseFloat(bashar.lexicon.spZone.getAttribute("height")) / 2;
			let shiftingRate = parseInt(clampedCursorYRatio * 100) - spZoneHalfHeight + "%";
			bashar.lexicon.spZone.setAttribute("y", shiftingRate);
			bashar.header.proposeSparkle(clampedCursorYRatio);
		},
		proposeSparkle: function(clampedCursorYRatio) {
			let minSparkleRangeX =
				parseFloat(bashar.lexicon.spZone.getAttribute("x")) / 100
				* parseFloat(bashar.lexicon.graphic.getAttribute("width"));
			let maxSparkleRangeX =
				parseFloat(bashar.lexicon.spZone.getAttribute("width")) / 100
				* parseFloat(bashar.lexicon.graphic.getAttribute("width"))
				+ minSparkleRangeX;
			let minSparkleRangeY =
				parseFloat(bashar.lexicon.spZone.getAttribute("y")) / 100
				* parseFloat(bashar.lexicon.graphic.getAttribute("height"));
			let maxSparkleRangeY =
				parseFloat(bashar.lexicon.spZone.getAttribute("height")) / 100
				* parseFloat(bashar.lexicon.graphic.getAttribute("height"))
				+ minSparkleRangeY;
			let sparkleX = bashar.util.randomIntBetween(minSparkleRangeX, maxSparkleRangeX);
			let sparkleY = bashar.util.randomIntBetween(minSparkleRangeY, maxSparkleRangeY);
			bashar.header.validateSparkle(sparkleX, sparkleY, clampedCursorYRatio);
		},
		validateSparkle: function(sparkleX, sparkleY, clampedCursorYRatio) {
			let validSparkle = false;
			let validationZones = bashar.lexicon.graphic.querySelectorAll("#g > *");
			let validationPoint = bashar.lexicon.graphic.createSVGPoint();
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
			bashar.main.displayJsOnly();
			// bashar.main.disableFolioAnchors();
			// bashar.main.distributeNotes();
			// bashar.main.trackNotes();
		},
		displayJsOnly: function() {
			if (!bashar.lexicon.jsOnly) { return; }
			bashar.lexicon.jsOnly.forEach((jsOnly) => {
				jsOnly.classList.remove("generic--jsOnly");
			});
		},
		// disableFolioAnchors: function() {
		// 	if (!bashar.lexicon.disabledAnchors) { return; }
		// 	bashar.lexicon.disabledAnchors.forEach((anchor) => {
		// 		anchor.addEventListener("click", (event) => {
		// 			event.preventDefault();
		// 			event.target.closest(".indexOfWorks__work__folio").classList.toggle("generic--flipped");
		// 			plausible("Flip");
		// 		});
		// 	});

		// },
		// trackNotes: function() {
		// 	window.addEventListener("resize", bashar.util.debounce(() => {
		// 		bashar.main.checkOverlappingNotes();
		// 	}, 500));
		// },
		// checkOverlappingNotes: function() {
		// 	if (bashar.util.queryMedia("(max-width: 1280px)")) {
		// 		bashar.main.resetNoteOffsets();
		// 		return;
		// 	}
		// 	var previousNoteOffsetTop = 0;
		// 	var previousNoteOffsetBottom = 0;
		// 	var noteOffsetDelta = 0;
		// 	var previousNoteOffsetDelta = 0;
		// 	var continuityCounter = 0;
		// 	bashar.lexicon.notes.forEach((note) => {
		// 		let noteOffsetTop = note.getBoundingClientRect().top;
		// 		let noteOffsetBottom = note.getBoundingClientRect().bottom;
		// 		if (noteOffsetTop < previousNoteOffsetBottom) {
		// 			noteOffsetDelta = previousNoteOffsetBottom - noteOffsetTop;
		// 			continuityCounter++;
		// 			let newOffsetTop = "calc(" + "-3.35rem + " + noteOffsetDelta + "px + " + previousNoteOffsetDelta + "px - " + continuityCounter + "px)";
		// 			note.style.marginTop = newOffsetTop;
		// 		} else {
		// 			noteOffsetDelta = 0;
		// 			continuityCounter = 0;
		// 		}
		// 		previousNoteOffsetTop = noteOffsetTop;
		// 		previousNoteOffsetBottom = noteOffsetBottom;
		// 		previousNoteOffsetDelta = noteOffsetDelta;
		// 	});
		// },
		// offsetOverlappingNotes: function(note, noteOffsetDelta) {

		// },
		// resetNoteOffsets: function() {
		// 	bashar.lexicon.notes.forEach((note) => {
		// 		note.style.removeProperty("margin-top");
		// 	});
		// },
		// distributeNotes: function() {
		// 	var previousNoteOffsetTop = 0;
		// 	var previousNoteOffsetBottom = 0;
		// 	var noteOffsetDelta = 0;
		// 	var previousNoteOffsetDelta = 0;
		// 	var continuityCounter = 0;
		// 	// if (bashar.util.queryMedia("(max-width: 1280px)")) { return; }
		// 	bashar.lexicon.notes.forEach((note) => {
		// 		let noteOffsetTop = note.getBoundingClientRect().top;
		// 		let noteOffsetBottom = note.getBoundingClientRect().bottom;
		// 		if (noteOffsetTop < previousNoteOffsetBottom) {
		// 			noteOffsetDelta = previousNoteOffsetBottom - noteOffsetTop;
		// 			continuityCounter++;
		// 			let newOffsetTop = "calc(" + "-3.35rem + " + noteOffsetDelta + "px + " + previousNoteOffsetDelta + "px - " + continuityCounter + "px)";
		// 			note.style.marginTop = newOffsetTop;
		// 		} else {
		// 			noteOffsetDelta = 0;
		// 			continuityCounter = 0;
		// 		}
		// 		previousNoteOffsetTop = noteOffsetTop;
		// 		previousNoteOffsetBottom = noteOffsetBottom;
		// 		previousNoteOffsetDelta = noteOffsetDelta;
		// 	});
		// },
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
		line: function(a, x, b) {
                        /* https://www.desmos.com/calculator */
                        return (a * x) + b;
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
		queryMedia: function(query) {
			return window.matchMedia(query).matches;
		},
	},

}

bashar.initAllScripts();
