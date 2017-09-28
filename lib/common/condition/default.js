"use strict";

module.exports = engine => {
	//Executes only if NO other rule has been executed for this flow
	engine.closures.addProvidedClosureImpl("default", (fact, context) => ! context.currentRuleFlowActivated );
}
