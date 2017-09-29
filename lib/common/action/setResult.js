"use strict";

const co = require("co");

module.exports = engine => {
	const fn = co.wrap(function *(fact, context) {
		const value = yield context.parameters.calculator.process(fact, context);
		fact[context.parameters.field] = value;
		return fact;
	});

	engine.closures.addProvidedClosureImpl("setResult", fn, {
		required: ["field", "calculator"],
		closureParameters: [ "calculator" ]
	});
}
