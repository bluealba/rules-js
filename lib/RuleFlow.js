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

	* process(factPromise) {
		factPromise = Promise.resolve(factPromise);

		for (let rule of this.rules) {
			const matches = yield rule.evaluateCondition(factPromise, this.engine);
			if (matches) { //TODO: break if this.rulesAddition === false and matches === true
				factPromise = rule.process(factPromise, this.engine);
			}
		}
		return factPromise;
	}

	toString() {
		return `[RuleFlow ${this.name}]`;
	}

}

module.exports = wrap(RuleFlow);
