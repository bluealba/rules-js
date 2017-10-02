"use strict";

const Closure = require("./Closure");

/**
 * A simple closure that's implemented through a function that is defined
 * in beforehand.
 *
 * @type {ProvidedClosure}
 */
class FunctionalClosure extends Closure {

	/**
	 * @param  {string}   name       the name of the clousre
	 * @param  {Function} fn         a function providing an implementation
	 *                               for this closure.
	 */
	constructor(name, fn, options) {
		super(name, options);
		if (typeof(fn) !== "function") {
			throw new TypeError(`Implementation for provided closure '${name}' is not a function`);
		}
		this.fn = fn;
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

}

module.exports = FunctionalClosure;
