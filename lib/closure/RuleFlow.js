"use strict";

const wrap = require("async-class-co").wrap,
	ClosureReducer = require("./ClosureReducer");

class RuleFlow extends ClosureReducer {

	* process(fact, context) {
		context.initiateFlow();
		fact = yield super.process(fact, context);
		context.endFlow();

		return fact
	}

}

module.exports = wrap(RuleFlow);
