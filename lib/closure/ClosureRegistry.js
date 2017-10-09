"use strict";

const FunctionalClosure = require("./FunctionalClosure"),
	ClosureChain = require("./ClosureReducer"),
	RuleFlow = require("./RuleFlow"),
	Rule = require("./Rule"),
	util = require("../util");

/**
 * ClosureFactory is the main entry point for creating closure out of the
 * closure definition json.
 *
 * It also acts as a registry for named-closure implementations which need to
 * be provided before parsing any named closure.
 *
 * @type {ClosureRegistry}
 */
module.exports = class ClosureRegistry {

	constructor(engine) {
		this.engine = engine;
		this.namedClosures = {};
	}
	/**
	 * Adds a closure to the registry by name hence becoming a
	 * NAMED closure.
	 *
	 * @param {String} name                 the name of the closure.
	 * @param {Closure|Function} closure    the Closure object or function implementation.
	 * @param {Object} options              closure registering options.
	 * @param {Boolean} options.override    this method will fail if a closure with
	 * 				the same name alrady exists, unless override is set to truthy.
	 *
	 * @return {Closure} the closure added
	 */
	add(name, closure, options = {}) {
		name || util.raise("Cannot add anonymous closure");

		if (closure.closureType) {
			options.required = options.required || closure.required;
			options.closureParameters = options.closureParameters || closure.closureParameters;
			closure = new closure(name, options);
		}
		if (typeof(closure) === "function") {
			closure = new FunctionalClosure(name, closure, options);
		}

		if (this.namedClosures[name] && !options.override) {
			throw new Error(`Already defined a closure with name '${name}'`);
		}
		this.namedClosures[name] = closure;
		return closure;
	}

	get(name) {
		const closure = this.namedClosures[name];
		if (! closure) {
			throw new Error(`Unexistent named closure [${name}]`);
		}
		return closure;
	}

	/**
	 * Creates a closure from its definition.
	 *
	 * If definition parameter is:
	 * - an array then a ClosureReducer will be created and each item in the array
	 * 	 will be parsed as a closure.
	 * - an object with the property `rules` then it's interpreted as a rule flow
	 * 	 (an special case of a ClosureReducer)
	 * - an object has either `when` or `then` properties it is assumed to be a Rule
	 * 	 and it is created parsing both `when` and `then` definition as closures.
	 *
	 * - if it is a string a parameterless implementation for it will be looked
	 *   up in the implementations registry.
	 * - if it is an object it will an implementation for `definition.closure`
	 *   will be looked up in the implementation registry.
	 *
	 * @param  {Object|string|Object[]} definition the json defintion for the closure
	 * @return {Object}            		a closure object (it will understand the
	 *                                message process)
	 */
	parse(definition) {
		if (Array.isArray(definition)) {
			return this._createReducer(definition); //closure reducer for arrays
		} else if (definition.rules) {
			return this._createRuleFlow(definition);
		} else if (definition.when || definition.then) {
			return this._createRule(definition);
		} else {
			return this._createNamedClosure(definition);
		}
	}

	_createReducer(definition) {
		const closures = definition.map(eachDefinition => this.parse(eachDefinition));
		return new ClosureChain(definition.name, closures);
	}

	_createRule(definition) {
		if (! definition.when) throw new Error(`Rule '${definition.name}' must define a valid when clause`);
		if (! definition.then) throw new Error(`Rule '${definition.name}' must define a valid then clause`);

		const condition = this.parse(definition.when);
		const action = this.parse(definition.then);
		return new Rule(definition.name, condition, action);
	}

	_createRuleFlow(definition) {
		const closures = definition.rules.map(eachDefinition => this.parse(eachDefinition));
		return new RuleFlow(definition.name, closures, { matchOnce: definition.matchOnce });
	}

	_createNamedClosure(definition) {
		definition = typeof(definition) === "string" ? { closure: definition } : definition;
		const closure = this.get(definition.closure);

		const parameters = Object.assign({}, definition);
		delete parameters.closure;

		return closure.bind(definition.name, parameters, this.engine);
	}

}
