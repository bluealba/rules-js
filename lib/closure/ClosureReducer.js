"use strict";

const Closure = require("./Closure"),
	util = require("../util");

/**
 * This is a closure composite that will reduce the fact execution through
 * a list of component closures. The result of each closure execution will
 * be used as fact for the next closure.
 *
 * @type {ClosureReducer}
 */
module.exports = class ClosureReducer extends Closure {

	constructor(name, closures, options) {
		super(name, options);
		this.closures = closures || util.raise(`Cannot build closure reducer [${name}] without closure chain`);
	}

	process(fact, context) {
		return this.reduce(0, fact, context);
	}

	reduce(index, fact, context) {
		if (this.closures.length <= index) {
			return fact;
		}

		return util.nowOrThen(this.closures[index].process(fact, context),
			fact => {
				if (this.options.matchOnce && context.currentRuleFlowActivated) {
					return fact;
				}
				return this.reduce(index + 1, fact, context);
			});
	}

}
