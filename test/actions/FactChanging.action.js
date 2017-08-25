"use strict";

const Action = require("../../lib/Action")

/**
 * Illustrates an action that is switching facts
 */
class FactChangingAction extends Action {

	perform(fact) {
		const clone = JSON.parse(JSON.stringify(fact));
		clone.newFact = true;
		return clone;
	}
}

FactChangingAction.actionName = "FactChanging";

module.exports = FactChangingAction;
