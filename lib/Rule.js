"use strict";

const wrap = require("async-class-co").wrap,
	closures = require("./closure");

class Rule {

	static create(engine, definition) {
		if (! definition.when) throw new Error(`Rule ${definition.name} must define a valid when clause`);
		if (! definition.then) throw new Error(`Rule ${definition.name} must define a valid then clause`);

		const condition = closures.create(engine, definition.when);
		const action = closures.create(engine, definition.then);
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


module.exports = wrap(Rule);
