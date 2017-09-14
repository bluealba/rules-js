"use strict";

const closures = require("../../closure"),
	co = require("co");

module.exports = engine => {
	const fn = co.wrap(function *(fact, params, context) {
		const value = yield params.calculator.process(fact, params, context);
		fact[params.field] = value;
		return fact;
	});

	engine.addNamedClosure("setResult", fn, {
		requiredParameters: ["field", "calculator"],
		mapParameters: (params, engine) => {
			params.calculator = closures.create(engine, params.calculator);
			return params;
		}
	});
}
