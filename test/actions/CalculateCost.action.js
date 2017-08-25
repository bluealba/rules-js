"use strict";

const Action = require("../../lib/Action")

/**
 * A simple async action that doesn't return anything
 */
class CalculateCostAction extends Action {

	perform(fact) {
		fact.model.cost = fact.model.price * fact.model.quantity + fact.model.commissions;
	}
}

CalculateCostAction.actionName = "CalculateCost";

module.exports = CalculateCostAction;
