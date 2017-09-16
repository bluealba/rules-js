"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("never", () => false);
}
