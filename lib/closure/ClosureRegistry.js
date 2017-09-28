"use strict";

const ProvidedClosure = require("./ProvidedClosure"),
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

	add(closure) {
		this.namedClosures[closure.name] = closure;
	}

	addProvidedClosureImpl(name, implementation, options) {
		if (this.namedClosures[name]) {
			throw new Error(`Already defined a closure with name '${name}'`);
		}
		if (typeof(implementation) !== "function") {
			throw new TypeError(`Implementation for provided closure '${name}' is not a function`);
		}

		this.namedClosures[name] = new ProvidedClosure(name, implementation, options);
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
	create(definition) {
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
		const closures = definition.map(eachDefinition => this.create(eachDefinition));
		return new ClosureChain(definition.name, closures);
	}

	_createRule(definition) {
		if (! definition.when) throw new Error(`Rule '${definition.name}' must define a valid when clause`);
		if (! definition.then) throw new Error(`Rule '${definition.name}' must define a valid then clause`);

		const condition = this.create(definition.when);
		const action = this.create(definition.then);
		return new Rule(definition.name, condition, action);
	}

	_createRuleFlow(definition) {
		const closures = definition.rules.map(eachDefinition => this.create(eachDefinition));
		return new RuleFlow(definition.name, closures);
	}

	_createNamedClosure(definition) {
		definition = typeof(definition) === "string" ? { closure: definition } : definition;

		const closure = this.namedClosures[definition.closure];
		if (! closure) {
			throw new Error(`Cannot find a named closure named '${definition.closure}'`);
		}

		let parameters = util.clone(definition);
		delete parameters.closure;

		return closure.bound(definition.name, parameters, this.engine);
	}

}
