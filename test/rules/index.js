"use strict";

const	Engine = require("../../lib/Engine"),
	commmons = require("../../lib/common");

const engine = new Engine();
commmons(engine);

//productTypeCondition - not really needed, generic equal can be used instead
engine.closures.addProvidedClosureImpl("productTypeCondition",
	(fact, { parameters }) => fact.productType === parameters.productType);

//setQuantity
engine.closures.addProvidedClosureImpl("fetchSecurityData", (fact, context) => {
	const securityPromise = context.engine.context.securityMasterSevice.fetch(fact.security);
	return securityPromise.then(security => {
		fact.security = security; //replaces security with full blown object
		return fact;
	})
})

//setQuantity
engine.closures.addProvidedClosureImpl("setQuantity", fact => {
	fact.quantity = fact.contracts * fact.security.contractSize;
	return fact;
})

//setCost
engine.closures.addProvidedClosureImpl("setCost", fact => {
	fact.cost = fact.price * fact.quantity;
	return fact;
})

//calculateCost - a version of setCost that returns not a fact but a simple value
engine.closures.addProvidedClosureImpl("calculateCost", fact => {
	return fact.price * fact.quantity;
});

//setPercentualCommission
engine.closures.addProvidedClosureImpl("setPercentualCommission", (fact, { parameters }) => {
	fact.commissions = fact.cost * parameters.percentualPoints / 100;
	return fact;
}, { requiredParameters: ["percentualPoints"] })

//calculateCommissions - a version of setCost that returns not a fact but a simple value
engine.closures.addProvidedClosureImpl("calculatePercentualCommission", (fact, { parameters }) => {
	return fact.cost * parameters.percentualPoints / 100;
}, { requiredParameters: ["percentualPoints"] })

module.exports = engine;
