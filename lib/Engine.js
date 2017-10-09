"use strict";

const co = require("co"),
	Context = require("./Context"),
	ClosureRegistry = require("./closure/ClosureRegistry");

module.exports = class Engine {

	constructor() {
		this.context = {};
		this.closures = new ClosureRegistry(this);
		this.process = co.wrap(this.process.bind(this));
	}

	add(definition, options) {
		const closure = this.closures.parse(definition);
		this.closures.add(closure.name, closure, options);
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
