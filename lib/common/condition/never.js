"use strict";

module.exports = engine => {
	engine.closures.addNamedClosureImpl("never", () => false);
}
