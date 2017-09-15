"use strict";

const wrap = require("async-class-co").wrap,
	Context = require("./Context"),
	ClosureFactory = require("./closure/ClosureFactory")

class Engine {

	constructor() {
		this.context = {};
		this.closures = new ClosureFactory(this);
	}

	* process(closure, fact) {
		const context = new Context(this);
		context.fact = yield closure.process(fact, context);
		return context;
	}

}

module.exports = wrap(Engine);
