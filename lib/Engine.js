"use strict";

const Context = require("./Context"),
	ClosureRegistry = require("./closure/ClosureRegistry");

module.exports = class Engine {

	constructor() {
		this.services = {};
		this.closures = new ClosureRegistry(this);
	}

	add(definition, options) {
		const closure = this.closures.parse(definition);
		this.closures.add(closure.name, closure, options);
	}

	reset() {
		this.closures = new ClosureRegistry(this);
	}

	process(closure, fact) {
		if (typeof (closure) === "string") {
			closure = this.closures.get(closure);
		}

		const context = new Context(this);
		try {
			return Promise.resolve(closure.process(fact, context)).then(fact => {
				context.fact = fact;
				return context;
			});
		} catch (error) {
			return Promise.reject(error);
		}
	}

}
