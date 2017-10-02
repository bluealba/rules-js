"use strict";

const util = require("./util");

module.exports = class Context {

	constructor(engine) {
		this.engine = engine;
		engine && engine.context && Object.keys(engine.context).forEach(key => {
			this[key] = engine.context[key];
		});

		this.parameters = {};
		this.rulesFired = [];
		this._ruleFlowTree = [];
		this._currentRuleFlowActivated = false;
	}

	initiateFlow(ruleFlow) {
		this._currentRuleFlowActivated = false;
		this._ruleFlowTree.push(ruleFlow);
	}

	endFlow() {
		this._ruleFlowTree.pop();
		this._currentRuleFlowActivated = !! this._ruleFlowTree.length;
	}

	get currentRuleFlowActivated() {
		return this._currentRuleFlowActivated
	}

	get currentFlow() {
		return this._ruleFlowTree[this._ruleFlowTree.length - 1];
	}

	ruleFired(rule) {
		this.rulesFired.push(rule);
		this._currentRuleFlowActivated = true;
	}

	bindParameters(newParameters) {
		const newParametersKeys = Object.keys(newParameters);
		if (newParametersKeys.length === 0) {
			return this.parameters;
		}

		const oldParameters = this.parameters;
		this.parameters = util.clone(this.parameters);
		newParametersKeys.forEach(key => this.parameters[key] = newParameters[key]);
		return oldParameters;
	}

	restore(oldParameters) {
		this.parameters = oldParameters;
	}

}
