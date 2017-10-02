"use strict";

module.exports = engine => {
	engine.closures.add("random", () => Math.random() >= 0.5);
}
