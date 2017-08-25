"use strict";

const _ = require("lodash"),
	Rule = require("./Rule");

class Flow {
	constructor(engine) {
		this.rules = [];
		this.engine = engine;
	}

	addRule(rule) {
		const ruleObject = new Rule(rule.condition, rule.action);
		this.rules.push(ruleObject);
	}

	process(fact) {
		return this._findMatchingRules(fact).reduce((factPromise, rule) => {
			return rule.fire(factPromise, this.engine);
		}, Promise.resolve(fact));
	}

	_findMatchingRules(fact) {
		const evaluation = rule => rule.condition.evaluate(fact, this.engine)

		if (this.rulesAddition === undefined || this.rulesAddition) {
			return _(this.rules).filter(evaluation)
		} else {
			const found = this.rules.find(evaluation);
			return _(found ? [found] : []);
		}
	}
}

module.exports = Flow;
