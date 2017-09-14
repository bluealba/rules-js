"use strict";

module.exports = engine => {
	engine.addNamedClosure("error", (fact, params) => { throw new Error(params.message) }, { requiredParameters: ["message"] });
}
