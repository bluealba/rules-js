"use strict";

module.exports = engine => {
	engine.closures.add("error", (fact, {parameters}) => { throw new Error(parameters.message) }, {
		required: ["message"]
	});
}
