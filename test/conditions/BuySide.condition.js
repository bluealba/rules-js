"use strict";

const Condition = require("../../lib/Condition");

/**
 * A simple non parameterized condition.
 */
class BuySideCondition extends Condition {
	evaluate(fact) {
		return fact.model.side === "buy";
	}
}
BuySideCondition.conditionName = "Buy";

module.exports = BuySideCondition;
