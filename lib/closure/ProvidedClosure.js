"use strict";

const Closure = require("./Closure");

/**
 * A simple closure that's implemented through a function that is defined
 * in beforehand.
 *
 * @type {ProvidedClosure}
 */
class ProvidedClosure extends Closure {

	/**
	 * @param  {string}   name       the name of the clousre
	 * @param  {Function} fn         a function providing an implementation
	 *                               for this closure.
	 */
	constructor(name, fn, options = {}) {
		super(name);
		this.fn = fn;
		this.options = options;
	}

	/**
	 * Evaluates the block against a fact promise
	 * @param {Object} fact 						a fact
	 * @param {Context} context					an execution context.
	 * @param {Context} context.engine	the rules engine
	 *
	 * @return {Promise} a promise that will be resolved to some result
	 */
	process(fact, context) {
		const result = this.fn.call(this, fact, context);
		return Promise.resolve(result);
	}

	bind(name, parameters, engine) {
		const missing = (this.options.required || []).find(required => parameters[required] === undefined)
		if (missing) {
			throw new Error(`Cannot instantiate provided closure '${this.name}'. Parameter ${missing} is unbounded`);
		}

		// Replaces parameters that are set as closureParamters with actual closures!
		if (this.options.closureParameters) {
			this.options.closureParameters.forEach(parameter => {
				parameters[parameter] = engine.closures.create(parameters[parameter]);
			})
		}
		return super.bind(name, parameters, engine);
	}

}

module.exports = ProvidedClosure;
