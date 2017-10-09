"use strict";

const co = require("co"),
	ClosureReducer = require("./ClosureReducer");


module.exports = class RuleFlow extends ClosureReducer {

	constructor(name, closures, options) {
		super(name, closures, options);
		this.do = co.wrap(this.do.bind(this));
	}

	* do(fact, context) {
		context.initiateFlow();
		fact = yield super.do(fact, context);
		context.endFlow();

		return fact
	}

}
