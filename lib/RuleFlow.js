"use strict";

const wrap = require("async-class-co").wrap,
	Rule = require("./Rule");

class RuleFlow {

	static create(engine, definition) {
		const flow = new RuleFlow(engine, definition.name, definition.rulesAddition);
		flow.rules = definition.rules.map(ruleDefinition => Rule.create(engine, ruleDefinition));
		return flow;
	}

	constructor(engine, name, rulesAddition) {
		this.engine = engine;
		this.name = name;
		this.rulesAddition = rulesAddition;
	}

	* process(fact) {
		fact = yield Promise.resolve(fact);
		fact = this.engine.createFact(fact);

		fact.initiateFlow();
		for (let rule of this.rules) {
			const matches = yield rule.evaluateCondition(fact, this.engine);
			if (matches) { //TODO: break if this.rulesAddition === false and matches === true
				fact = yield rule.process(fact, this.engine);
			}
		}
		fact.endFlow();

		return fact
	}

	toString() {
		return `[RuleFlow ${this.name}]`;
	}

}

module.exports = wrap(RuleFlow);
