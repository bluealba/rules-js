"use strict";

const closures = require("../closure");

module.exports = engine => {
	engine.addNamedClosure("error", (fact, params) => { throw new Error(params.message) });

	engine.addNamedClosure("setResult", (fact, params, engine) => {
		const value = params.calculator.process(fact, params, engine);
		fact[params.field] = value;
		return fact;
	}, {
		requiredFields: ["field", "calculator"],
		parameterParser: (params, engine) => {
			params.calculator = closures.create(engine, params.calculator);
		}
	});
}
