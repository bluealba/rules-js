"use strict";

/**
 * A closure that its identified by a name. All closures expose the method
 * process(fact, context) that allows them to operate as predicates or
 * transfomers of a certain fact.
 *
 * @type {Closure}
 */
class Closure {

	constructor(name) {
		this.name = name;
	}

	get named() {
		return !!this.name;
	}

	/**
	 * Evaluates the closure against a certain fact
	 *
	 * @param {Object} fact								a fact
	 * @param {Context} context						an execution context.
	 * @param {Object} context.parameters the execution parameters, if any
	 * @param {Engine} context.engine			the rules engine
	 *
	 * @return {Promise} a promise that will be resolved to some result
	 */
	process(fact, context) {
		throw new Error("This is an abstract closure, how did you get to instantiate this?");
	}

	/**
	 * Binds this closure to a set of parameters. This will return a new Closure than
	 * when invoked it will ALWAYS pass the given parameters as a fields inside the
	 * context.parameters object.
	 *
	 * @param {String} name - the name, if specified, of the resulting bounded closure
	 * @param {Object} parameters - the parameters to bound to the closure
	 * @param {Engine} engine - the rules engine instance
	 */
	bind(name, parameters, engine) {
		return new BoundClosure(name, this, parameters)
	}

}


/**
 * A closure bound to a certain set of parameters
 *
 * @type {BoundClosure}
 */
class BoundClosure extends Closure {

	constructor(name, closure, parameters) {
		super(name);
		this.closure = closure;
		this.parameters = parameters || {};
	}

	process(fact, context) {
		const oldParameters = context.bindParameters(this.parameters);
		return this.closure.process(fact, context).then(r => {
			context.restore(oldParameters);
			return r;
		});
	}

}

module.exports = Closure;
