"use strict";

const wrap = require("async-class-co").wrap,
	Context = require("./Context"),
	ClosureRegistry = require("./closure/ClosureRegistry")

class Engine {

	constructor() {
		this.context = {};
		this.closures = new ClosureRegistry(this);
	}

	add(definition, override) {
		const closure = this.closures.create(definition);
		closure.name && this.closures.add(closure, override);
	}

	reset() {
		this.closures = new ClosureRegistry(this);
	}

	* process(closure, fact) {
		if (typeof(closure) === "string") {
			closure = this.closures.get(closure);
		}

		const context = new Context(this);
		context.fact = yield closure.process(fact, context);
		return context;
	}

}

module.exports = wrap(Engine);
