"use strict";

const wrap = require("async-class-co").wrap;

class ClosureChain {

	static create(engine, definition) {
		return new ClosureChain(definition);
	}

	constructor(closures) {
		this.closures = closures;
	}

	* process(fact, engine) {
		for (let closure of this.closures) {
			fact = yield closure.process(fact, engine);
		}
		return fact;
	}

}

module.exports = wrap(ClosureChain);
