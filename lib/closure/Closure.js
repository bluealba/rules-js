"use strict";

/**
 * A closure that its identified by a name. All closures expose the method
 * process(fact, context) that allows them to operate as predicates or
 * transfomers of a certain fact.
 *
 * @type {Closure}
 */
class Closure {

	constructor(name, options) {
		this.name = name;
		this.options = options || {};
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
		const result = this.do(fact, context);
		return Promise.resolve(result);
	}

	/**
	 * Evaluates the closure against a certain fact
	 *
	 * @param {Object} fact								a fact
	 * @param {Context} context						an execution context.
	 * @param {Object} context.parameters the execution parameters, if any
	 * @param {Engine} context.engine			the rules engine
	 *
	 * @return {Object} the result of the evaluation
	 */
	do(fact, context) {
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
		// const missing = (this.options.required || []).find(required => parameters[required] === undefined)
		// if (missing) {
		// 	throw new Error(`Cannot instantiate provided closure '${this.name}'. Parameter ${missing} is unbounded`);
		// }

		// No need to perform any binding, there is nothing to bind
		if (! Object.keys(parameters).length) {
			return this;
		}

		// Replaces parameters that are set as closureParamters with actual closures!
		// TODO: do we really need this? can we do it differently? I hate expanding the options
		// list
		if (this.options.closureParameters) {
			this.options.closureParameters.forEach(parameter => {
				parameters[parameter] = engine.closures.parse(parameters[parameter]);
			})
		}

		return new BoundClosure(name, this, parameters)
	}

}

Closure.closureType = true;

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
