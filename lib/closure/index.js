"use strict";

const NamedClosure = require("./NamedClosure"),
	ClosureChain = require("./ClosureChain"),
	util = require("../util");

module.exports = {
	create(engine, definition) {
		if (Array.isArray(definition)) {
			const closures = definition.map(eachDefinition => this.create(engine, eachDefinition));
			return new ClosureChain(closures);

		} else if (definition.rules) {
			const RuleFlow = require("../RuleFlow");
			return RuleFlow.create(engine, definition); //rule flow IS a closure too!

		} else {
			definition = typeof(definition) === "string" ? { closure: definition } : definition; //code-sugar

			const implementor = engine.getNamedClosure(definition.closure);

			let parameters = util.clone(definition);
			delete parameters.closure;

			implementor.validator(parameters, engine);
			parameters = implementor.mapParameters(parameters, engine);

			return new NamedClosure(definition.closure, implementor.fn, parameters);
		}
	}
}
