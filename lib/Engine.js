"use strict";

const RuleFlow = require("./RuleFlow"),
	Fact = require("./Fact");

module.exports = class Engine {

	constructor() {
		this.context = {};
		this.closures = {};
	}

	createRuleFlow(definition) {
		return RuleFlow.create(this, definition);
	}

	getNamedClosure(name) {
		const closure = this.closures[name];
		if (! closure) {
			throw new Error(`Cannot find rule closure of named ${name}`);
		}
		return closure;
	}

	addNamedClosure(name, closure, { requiredParameters } = {}) {
		if (this.closures[name]) {
			throw new Error(`Already defined a closure with name ${name}`);
		}

		if (typeof(closure) !== "function") {
			throw new TypeError(`NamedClosure ${name} is not a function`);
		}

		this.closures[name] = {
			fn: closure,
			validator: params => {
				const missing = (requiredParameters || []).some(required => params[required] === undefined)
				if (missing) {
					throw new Error(`NamedClosure ${name} is missing parameter ${missing}`);
				}
			}
		}
	}

	createFact(model) {
		return (model instanceof Fact) ? model : new Fact(model);
	}

}
