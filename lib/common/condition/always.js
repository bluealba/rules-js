"use strict";

module.exports = engine => {
	engine.closures.addNamedClosureImpl("always", () => true);
}
