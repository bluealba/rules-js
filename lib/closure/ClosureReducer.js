"use strict";

const wrap = require("async-class-co").wrap;

/**
 * This is a closure composite that will reduce the fact execution through
 * a list of component closures. The result of each closure execution will
 * be used as fact for the next closure.
 * @type {ClosureReducer}
 */
class ClosureReducer {

	constructor(closures) {
		this.closures = closures;
	}

	* process(fact, context) {
		for (let closure of this.closures) {
			fact = yield closure.process(fact, context);
		}
		return fact;
	}

}

module.exports = wrap(ClosureReducer);
