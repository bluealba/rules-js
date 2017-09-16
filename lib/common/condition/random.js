"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("random", () => Math.random() >= 0.5);
}
