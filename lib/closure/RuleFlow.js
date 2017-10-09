"use strict";

const ClosureReducer = require("./ClosureReducer");

module.exports = class RuleFlow extends ClosureReducer {

	do(fact, context) {
		context.initiateFlow();
		return super.do(fact, context).then(fact => {
			context.endFlow();
			return fact;
		});
	}

}
