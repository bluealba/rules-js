"use strict";

module.exports = class Context {

	constructor(engine, parameters, rulesFired, currentRuleFlowActivated) {
		this.engine = engine;
		this.parameters = parameters || {};
		this.rulesFired = rulesFired || [];
		this._currentRuleFlowActivated = !! currentRuleFlowActivated;
	}

	initiateFlow(ruleFlow) {
		this._currentRuleFlowActivated = false;
	}

	endFlow() {
		this._currentRuleFlowActivated = true;
	}

	get currentRuleFlowActivated() {
		return this._currentRuleFlowActivated
	}

	ruleFired(rule) {
		this.rulesFired.push(rule);
		this._currentRuleFlowActivated = true;
	}

	/**
	 * Creates a new context bound to the new set of parameters
	 * @param {Object} newParameters
	 */
	bindParameters(newParameters) {
		const parameters = Object.assign({}, this.parameters, newParameters);
		return new Context(this.engine, parameters, this.rulesFired, this._currentRuleFlowActivated);
	}

}
