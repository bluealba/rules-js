"use strict";

module.exports = engine => {
	engine.closures.addNamedClosureImpl("error", (fact, params) => { throw new Error(params.message) }, { requiredParameters: ["message"] });
}
