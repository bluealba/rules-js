"use strict";

const Condition = require("../lib/Condition");

/**
 * Matches everything
 */
class MatchAllCondition extends Condition {
	evaluate(fact) { // eslint-disable-line no-unused-vars
		return true;
	}
}
MatchAllCondition.conditionName = "MatchAll";

module.exports = MatchAllCondition;
