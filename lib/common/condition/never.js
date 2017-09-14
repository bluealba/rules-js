"use strict";

module.exports = engine => {
	engine.addNamedClosure("never", () => false);
}
