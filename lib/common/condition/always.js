"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("always", () => true);
}
