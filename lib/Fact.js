"use strict";

module.exports = class Fact {

	constructor(model) {
		this.model = model;
		this.rulesFired = [];
	}

	initiateFlow() {
		const parentFlow = this.currentFlowFiredRules;
		this.currentFlowFiredRules = [];
		this.currentFlowFiredRules.parent = parentFlow;
	}

	endFlow() {
		this.currentFlowFiredRules = this.currentFlowFiredRules.parent;
	}

	ruleFired(rule) {
		this.currentFlowFiredRules.push(rule);
		this.rulesFired.push(rule);
	}

}
