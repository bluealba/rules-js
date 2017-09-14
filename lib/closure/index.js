"use strict";

const NamedClosure = require("./NamedClosure"),
	ClosureChain = require("./ClosureChain")

module.exports = {
	create(engine, definition) {
		if (Array.isArray(definition)) {
			const closures = definition.map(eachDefinition => this.create(engine, eachDefinition));
			return ClosureChain.create(engine, closures);
		} else if (definition.rules) {
			const RuleFlow = require("../RuleFlow");
			return RuleFlow.create(engine, definition); //rule flow IS a closure too!
		} else {
			return NamedClosure.create(engine, definition);
		}
	}
}
