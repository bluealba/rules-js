"use strict";

module.exports = engine => {
	engine.closures.add("identity", fact => fact);
}
