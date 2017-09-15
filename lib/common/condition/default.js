"use strict";

module.exports = engine => {
	//Executes only if NO other rule has been executed for this flow
	engine.closures.addNamedClosureImpl("default", (fact, params, context) => ! context.currentRuleFlowActivated );
}
