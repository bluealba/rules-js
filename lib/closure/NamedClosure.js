"use strict";

/**
 * A simple closure that its identified by a name and bound to a certain set of
 * execution parameters.
 *
 * @type {NamedClosure}
 */
class NamedClosure {

	/**
	 * @param  {string}   name       the name of the clousre
	 * @param  {Function} fn         a function providing an implementation
	 *                               for this closure.
	 * @param  {Object}   parameters a set of bound parameters that will be
	 *                               provided to the closure function, allowing
	 *                               the possibility of reusing implementation
	 *                               functions.
	 */
	constructor(name, fn, parameters) {
		this.name = name;
		this.fn = fn;
		this.parameters = parameters;
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
		const result = this.fn.call(this, fact, this.parameters, context);
		return Promise.resolve(result);
	}

}

module.exports = NamedClosure;
