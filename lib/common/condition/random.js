"use strict";

module.exports = engine => {
	engine.closures.addNamedClosureImpl("random", () => Math.random() >= 0.5);
}
