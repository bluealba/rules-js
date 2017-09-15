"use strict";

const wrap = require("async-class-co").wrap,
	ClosureReducer = require("./ClosureReducer");

class RuleFlow extends ClosureReducer {

	constructor(name, closures) {
		super(closures);
		this.name = name;
	}

	* process(fact, context) {
		context.initiateFlow();
		fact = yield super.process(fact, context);
		context.endFlow();

		return fact
	}

	toString() {
		return `[RuleFlow ${this.name}]`;
	}

}

module.exports = wrap(RuleFlow);
