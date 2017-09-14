"use strict";

const wrap = require("async-class-co").wrap;

class ClosureChain {

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

module.exports = wrap(ClosureChain);
