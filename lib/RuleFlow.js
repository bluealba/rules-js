"use strict";

const wrap = require("async-class-co").wrap,
	Rule = require("./Rule");

class RuleFlow {

	static create(engine, definition) {
		const flow = new RuleFlow(definition.name);
		flow.rules = definition.rules.map(ruleDefinition => Rule.create(engine, ruleDefinition));
		return flow;
	}

	constructor(name) {
		this.name = name;
	}

	* process(fact, context) {
		fact = yield Promise.resolve(fact);

		context.initiateFlow();
		for (let rule of this.rules) {
			fact = yield rule.process(fact, context);
		}
		context.endFlow();

		return fact
	}

	toString() {
		return `[RuleFlow ${this.name}]`;
	}

}

module.exports = wrap(RuleFlow);
