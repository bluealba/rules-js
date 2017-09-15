"use strict";

const NamedClosure = require("./NamedClosure"),
	ClosureChain = require("./ClosureReducer"),
	RuleFlow = require("./RuleFlow"),
	Rule = require("./Rule"),
	util = require("../util");

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
				const missing = (requiredParameters || []).some(required => params[required] === undefined)
				if (missing) {
					throw new Error(`Closure ${name} is missing parameter ${missing}`);
				}
			},
			mapParameters: mapParameters || (x => x)
		}
	}

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
