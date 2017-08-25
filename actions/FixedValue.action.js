"use strict";

const Action = require("../lib/Action")

/**
 * FixedValueAction just sets the configured value into the fact's model field
 * specified.
 *
 * @type {FixedValueAction}
 */
class FixedValueAction extends Action {

	perform(fact) {
		fact.model[this.params.field] = this.params.value;
	}

}

FixedValueAction.actionName = "FixedValue";
FixedValueAction.expectedParams = [ "field", "value" ]

module.exports = FixedValueAction;
