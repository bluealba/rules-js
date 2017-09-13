"use strict";

const wrap = require("async-class-co").wrap,
	Block = require("./Block"),
	RuleFlow = require("./RuleFlow");

class Rule {

	static create(engine, definition) {
		const condition = Block.create(engine, definition.when);
		const action = createActionBlock(engine, definition.then);
		return new Rule(definition.name, condition, action);
	}

	constructor(name, condition, action) {
		this.name = name;
		this.condition = condition;
		this.action = action;
	}

	/**
	 * Executes the actions associated with this rule over the promised fact
	 * @param  {Promise} factPromise a Promise that should be resovled to a new
	 *                               fact
	 * @param  {Engine} engine       the pricing engine object
	 * @return {Promise}             a Promise that will be resolved to a fact
	 */
	* process(factPromise, engine) {
		const fact = yield this.action.process(factPromise, engine);

		const firedRules = fact.firedRules || [];
		firedRules.push(this);
		fact.firedRules = firedRules;
		return fact;
	}

	/**
	 * Evaluates a condition
	 */
	evaluateCondition(factPromise, engine) {
		return this.condition.process(factPromise, engine);
	}

	toString() {
		return `[Rule ${this.name}]`;
	}

}

function createActionBlock(engine, then) {
	if (Array.isArray(then)) {
		const actions = then.map(actionDefinition => Block.create(engine, actionDefinition));
		return {
			process(factPromise, engine) {
				return actions.reduce((newFactPromise, eachAction) => eachAction.process(newFactPromise, engine), factPromise)
			}
		}
	} else if (then.rules) {
		return RuleFlow.create(engine, then);
	} else {
		return Block.create(engine, then);
	}
}

module.exports = wrap(Rule);
