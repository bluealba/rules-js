"use strict";

const RuleFlow = require("./RuleFlow");

module.exports = class Engine {

	constructor() {
		this.context = {};
		this.implementors = {};
	}

	createRuleFlow(definition) {
		return RuleFlow.create(this, definition);
	}

	getImplementor(name) {
		const implementor = this.implementors[name];
		if (! implementor) {
			throw new Error(`Cannot find implementor of condition/action named ${name}`);
		}
		return implementor;
	}

	addImplementor(name, fn) {
		this.implementors[name] = fn;
	}

}
