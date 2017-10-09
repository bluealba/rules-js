"use strict";

const Closure = require("./Closure"),
	util = require("../util");

/**
 * A rule is a named conditional closure. It understands the `process` message
 * but it will only fire its internal closure action if the provided fact matches
 * the associated conditional closure.
 *
 * @type {Rule}
 */
module.exports = class Rule extends Closure{

	constructor(name, condition, action) {
		super(name);
		this.condition = condition || util.raise(`Cannot build rule [${name}] without condition closure`);
		this.action = action || util.raise(`Cannot build rule [${name}] without action closure`);
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
	do(fact, context) {
		return this.evaluateCondition(fact, context).then(matches => {
			if (matches) {
				context.ruleFired(this);
				return this.action.process(fact, context);
			}
			return fact;
		});
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
