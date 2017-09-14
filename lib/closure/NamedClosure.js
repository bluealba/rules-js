"use strict";

class NamedClosure {

	constructor(name, fn, parameters) {
		this.name = name;
		this.fn = fn;
		this.parameters = parameters;
	}

	/**
	 * Evaluates the block against a fact promise
	 * @param {Fact} a fact
	 * @param {Engine}  engine the contextual fact engine
	 * @return {Promise} a promise that will be resolved to the block result
	 */
	process(fact, engine) {
		const result = this.fn.call(this, fact, this.parameters, engine);
		return Promise.resolve(result);
	}

}

module.exports = NamedClosure;
