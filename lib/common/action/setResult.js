"use strict";

const co = require("co");

module.exports = engine => {
	const fn = co.wrap(function *(fact, params, context) {
		const value = yield params.calculator.process(fact, params, context);
		fact[params.field] = value;
		return fact;
	});

	engine.closures.addProvidedClosureImpl("setResult", fn, {
		requiredParameters: ["field", "calculator"],
		mapParameters: (params, engine) => {
			params.calculator = engine.closures.create(params.calculator);
			return params;
		}
	});
}
