"use strict";

module.exports = engine => {
	engine.closures.add("always", () => true);
}
