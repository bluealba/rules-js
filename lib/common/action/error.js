"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("error", (fact, params) => { throw new Error(params.message) }, {
		requiredParameters: ["message"]
	});
}
