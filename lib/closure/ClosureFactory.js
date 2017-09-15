"use strict";

const NamedClosure = require("./NamedClosure"),
	ClosureChain = require("./ClosureReducer"),
	RuleFlow = require("./RuleFlow"),
	Rule = require("./Rule"),
	util = require("../util");

/**
 * ClosureFactory is the main entry point for creating closure out of the
 * closure definition json.
 *
 * It also acts as a registry for named-closure implementations which need to
 * be provied before parsing any named closure.
 *
 * @type {Closure}
 */
module.exports = class ClosureFactory {

	constructor(engine) {
		this.engine = engine;
		this.implementations = {};
	}

	getNamedClosureImpl(name) {
		const closure = this.implementations[name];
		if (! closure) {
			throw new Error(`Cannot find a closure implementation named ${name}`);
		}
		return closure;
	}

	addNamedClosureImpl(name, closure, { requiredParameters, mapParameters } = {}) {
		if (this.implementations[name]) {
			throw new Error(`Already defined a closure implementation with name ${name}`);
		}

		if (typeof(closure) !== "function") {
			throw new TypeError(`Implementation for named closure ${name} is not a function`);
		}

		this.implementations[name] = {
			fn: closure,
			validator: params => {
				//TODO: validate optional parameters!
				const missing = (requiredParameters || []).some(required => params[required] === undefined)
				if (missing) {
					throw new Error(`Closure ${name} is missing parameter ${missing}`);
				}
			},
			mapParameters: mapParameters || (x => x)
		}
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
			return this.createReducer(definition); //closure reducer for arrays
		} else if (definition.rules) {
			return this.createRuleFlow(definition);
		} else if (definition.when || definition.then) {
			return this.createRule(definition);
		} else {
			return this.createNamedClosure(definition);
		}
	}

	createReducer(definition) {
		const closures = definition.map(eachDefinition => this.create(eachDefinition));
		return new ClosureChain(closures);
	}

	createRule(definition) {
		if (! definition.when) throw new Error(`Rule ${definition.name} must define a valid when clause`);
		if (! definition.then) throw new Error(`Rule ${definition.name} must define a valid then clause`);

		const condition = this.create(definition.when);
		const action = this.create(definition.then);
		return new Rule(definition.name, condition, action);
	}

	createRuleFlow(definition) {
		const closures = definition.rules.map(eachDefinition => this.create(eachDefinition));
		return new RuleFlow(definition.name, closures);
	}

	createNamedClosure(definition) {
		definition = typeof(definition) === "string" ? { closure: definition } : definition; //code-sugar

		const implementor = this.getNamedClosureImpl(definition.closure);

		let parameters = util.clone(definition);
		delete parameters.closure;

		implementor.validator(parameters, this.engine);
		parameters = implementor.mapParameters(parameters, this.engine);

		return new NamedClosure(definition.closure, implementor.fn, parameters);
	}


}
