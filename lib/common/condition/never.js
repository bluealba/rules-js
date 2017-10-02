"use strict";

module.exports = engine => {
	engine.closures.add("never", () => false);
}
