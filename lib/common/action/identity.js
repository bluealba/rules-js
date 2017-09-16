"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("identity", fact => fact);
}
