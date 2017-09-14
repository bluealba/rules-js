"use strict";

module.exports = engine => {
	//Executes only if NO other rule has been executed for this flow
	engine.addNamedClosure("default", (fact, params, context) => ! context.currentRuleFlowActivated );
}
