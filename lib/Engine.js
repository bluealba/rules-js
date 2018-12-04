"use strict";

const Context = require("./Context"),
	ClosureRegistry = require("./closure/ClosureRegistry");

module.exports = class Engine {

	constructor() {
		this.services = {};
		this.closures = new ClosureRegistry(this);
	}

	add(definition, options) {
		const closureOrClosures = this.closures.parse(definition);

		// if I get an array, then I assume that it is an array of definitions, and add each of them
		if (Array.isArray(closureOrClosures)) {
			closureOrClosures.forEach(clos => this.closures.add(clos.name, clos, options))
		} else {
			// non-array case
			this.closures.add(closureOrClosures.name, closureOrClosures, options);
		}
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
