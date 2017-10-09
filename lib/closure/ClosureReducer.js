"use strict";

const Closure = require("./Closure"),
	wrap = require("async-class-co").wrap,
	util = require("../util");

/**
 * This is a closure composite that will reduce the fact execution through
 * a list of component closures. The result of each closure execution will
 * be used as fact for the next closure.
 *
 * @type {ClosureReducer}
 */
class ClosureReducer extends Closure {

	constructor(name, closures, options) {
		super(name, options);
		this.closures = closures || util.raise(`Cannot build closure reducer [${name}] without closure chain`);
	}

	* do(fact, context) {
		for (let closure of this.closures) {
			fact = yield closure.process(fact, context);
			if (this.options.matchOnce && context.currentRuleFlowActivated) {
				return fact;
			}
		}
		return fact;
	}

}

module.exports = wrap(ClosureReducer);
