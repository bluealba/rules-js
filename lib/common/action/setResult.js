"use strict";

const closures = require("../../closure"),
	co = require("co");

module.exports = engine => {
	const fn = co.wrap(function *(fact, params, engine) {
		const value = yield params.calculator.process(fact, params, engine);
		fact.model[params.field] = value;
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
