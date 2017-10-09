"use strict";

module.exports = engine => {
	engine.closures.add("undefined", fact => undefined);
}
