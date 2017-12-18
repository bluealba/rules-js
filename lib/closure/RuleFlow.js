"use strict";

const ClosureReducer = require("./ClosureReducer"),
	util = require("../util")

module.exports = class RuleFlow extends ClosureReducer {

	process(fact, context) {
		context.initiateFlow();
		return util.nowOrThen(super.process(fact, context), fact => {
			context.endFlow();
			return fact;
		});
	}

}
