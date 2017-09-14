"use strict";

module.exports = engine => {
	engine.addNamedClosure("random", () => Math.random() >= 0.5);
}
