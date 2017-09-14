"use strict";

class NamedClosure {

	constructor(name, fn, parameters) {
		this.name = name;
		this.fn = fn;
		this.parameters = parameters;
	}

	/**
	 * Evaluates the block against a fact promise
	 * @param {Object} a fact
	 * @param {Context}  an execution context.
	 * @return {Promise} a promise that will be resolved to the block result
	 */
	process(fact, context) {
		const result = this.fn.call(this, fact, this.parameters, context);
		return Promise.resolve(result);
	}

}

module.exports = NamedClosure;
