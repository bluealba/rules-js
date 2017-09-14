"use strict";

module.exports = engine => {
	engine.addNamedClosure("always", () => true);
	engine.addNamedClosure("never", () => false);
	engine.addNamedClosure("random", () => Math.random() >= 0.5);

	//Executes only if NO other rule has been executed for this flow
	engine.addNamedClosure("default", fact => ! fact.currentRuleFlowActivated );

	//Matches only if certain model field (specified by field) equals to some
	//other specified value
	engine.addNamedClosure("equal", (fact, params) => fact.model[params.field] === params.value, {
		requiredParameters: ["field", "value"]
	} );
}
