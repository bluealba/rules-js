"use strict";

module.exports = engine => {
	engine.closures.addNamedClosureImpl("identity", fact => fact);
}
