"use strict";

module.exports = engine => {
	engine.addImplementor("always", () => true);
	engine.addImplementor("never", () => false);
	engine.addImplementor("random", () => Math.random() >= 0.5);

	//Executes only if NO other rule has been executed for this flow
	engine.addImplementor("default", fact => ! fact.currentFlowFiredRules || ! fact.currentFlowFiredRules.length );
}
