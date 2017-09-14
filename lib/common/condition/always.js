"use strict";

module.exports = engine => {
	engine.addNamedClosure("always", () => true);
}
