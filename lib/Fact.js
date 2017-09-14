"use strict";

module.exports = class Fact {

	constructor(model) {
		this.model = model;
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

}
