"use strict";

const Action = require("../../lib/Action")

/**
 * An action that relies on an external service result (which resolves asynchronically)
 * @type {CommissionsAction}
 */
class CalculateCommissionsAction extends Action {

	perform(fact, engine) {
		return engine.context.commissionService.calculateCommissions(fact.model.price * fact.model.quantity)
			.then(commissions => {
				fact.model.commissions = commissions;
				return fact;
			})
	}
}

CalculateCommissionsAction.actionName = "CalculateCommissions";

module.exports = CalculateCommissionsAction;
