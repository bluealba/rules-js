"use strict";

const wrap = require("async-class-co").wrap,
	Block = require("./Block");

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
	 * @param  {Promise} fact 	a fact
	 * @param  {Engine} engine	the pricing engine object
	 * @return {Promise}				a Promise that will be resolved to a fact
	 */
	* process(fact, engine) {
		fact = yield this.action.process(fact, engine);
		fact.ruleFired(this);
		return fact;
	}

	/**
	 * Evaluates a condition
	 * @param  {Promise} fact 	a fact
	 * @param  {Engine} engine	the pricing engine object
	 * @return {Promise}				a Promise that will be resolved to a truthy/falsey
	 */
	evaluateCondition(fact, engine) {
		return this.condition.process(fact, engine);
	}

	toString() {
		return `[Rule ${this.name}]`;
	}

}

function createActionBlock(engine, then) {
	if (Array.isArray(then)) {
		const actions = then.map(actionDefinition => Block.create(engine, actionDefinition));
		return {
			* process(fact, engine) {
				for (let action of actions) {
					fact = yield action.process(fact, engine);
				}
				return fact;
			}
		}
	} else if (then.rules) {
		const RuleFlow = require("./RuleFlow");
		return RuleFlow.create(engine, then);
	} else {
		return Block.create(engine, then);
	}
}

module.exports = wrap(Rule);
