"use strict";

const wrap = require("async-class-co").wrap,
	RuleFlow = require("./RuleFlow"),
	Context = require("./Context");

class Engine {

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

	addNamedClosure(name, closure, { requiredParameters, mapParameters } = {}) {
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
			},
			mapParameters: mapParameters || (x => x)
		}
	}

	* process(closure, fact) {
		const context = new Context(this);
		context.fact = yield closure.process(fact, context);
		return context;
	}

}

module.exports = wrap(Engine);
