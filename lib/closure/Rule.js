"use strict";

const wrap = require("async-class-co").wrap;

/**
 * A rule is a named conditional closure. It understands the `process` message
 * but it will only fire its internal closure action if the provided fact matches
 * the associated conditional closure.
 *
 * @type {Rule}
 */
class Rule {

	constructor(name, condition, action) {
		this.name = name;
		this.condition = condition;
		this.action = action;
	}

	/**
	 * Executes the actions associated with this rule over certain fact
	 * @param {Object} fact 	   				a fact
	 * @param {Context} context 				an execution context
	 * @param {Context} context.engine	the rules engine
	 *
	 * @return {Promise} a promise that will be resolved to some result (typically
	 *                   such result will be used as next's rule fact)
	 */
	* process(fact, context) {
		const matches = yield this.evaluateCondition(fact, context);
		if (matches) {
			context.ruleFired(this);
			fact = yield this.action.process(fact, context);
		}
		return fact;
	}

	/**
	 * Evaluates a condition
	 * @param  {Promise} fact 	a fact
	 * @param  {Context} engine	an execution context
	 * @return {Promise}				a Promise that will be resolved to a truthy/falsey
	 */
	evaluateCondition(fact, context) {
		return this.condition.process(fact, context);
	}

}


module.exports = wrap(Rule);
