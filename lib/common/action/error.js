"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("error", (fact, context) => { throw new Error(context.parameters.message) }, {
		requiredParameters: ["message"]
	});
}
