"use strict";

module.exports = class Context {

	constructor(engine) {
		this.engine = engine;
		engine && engine.context && Object.assign(this, engine.context);

		this.parameters = {};
		this.rulesFired = [];
		this._currentRuleFlowActivated = false;
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

	bindParameters(newParameters) {
		const oldParameters = this.parameters;

		for (let key in newParameters) {
			if (oldParameters === this.parameters) {
				this.parameters = Object.assign({}, this.parameters);
			}
			this.parameters[key] = newParameters[key];
		}
		return oldParameters;
	}


	restore(oldParameters) {
		this.parameters = oldParameters;
	}

}
