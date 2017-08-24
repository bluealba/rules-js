"use strict";

const Condition = require("../../lib/Condition");

/**
 * A simple parameterized condition.
 */
class SideCondition extends Condition {
	evaluate(fact) {
		return fact.model.side === this.params.expectedSide;
	}
}
SideCondition.conditionName = "Side";
SideCondition.expectedParams = [ "expectedSide" ];

module.exports = SideCondition;
