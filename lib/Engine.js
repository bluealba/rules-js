"use strict";

const wrap = require("async-class-co").wrap,
	Context = require("./Context"),
	ClosureRegistry = require("./closure/ClosureRegistry")

class Engine {

	constructor() {
		this.context = {};
		this.closures = new ClosureRegistry(this);
	}

	add(definition) {
		const closure = this.closures.create(definition);
		closure.name && this.closures.addNamedClosure(closure);
	}

	* process(closure, fact) {
		const context = new Context(this);
		context.fact = yield closure.process(fact, context);
		return context;
	}

}

module.exports = wrap(Engine);
