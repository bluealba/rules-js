"use strict";

module.exports = engine => {
	engine.closures.addProvidedClosureImpl("error", (fact, {parameters}) => { throw new Error(parameters.message) }, {
		required: ["message"]
	});
}
