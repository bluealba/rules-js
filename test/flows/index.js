"use strict";

const	Engine = require("../../lib/Engine"),
	commmons = require("../../lib/common");

const engine = new Engine();
commmons(engine);

//productTypeCondition - not really needed, generic equal can be used instead
engine.closures.add("productTypeCondition", (fact, context) => {
	return fact.productType === context.parameters.productType;
});

//setQuantity
engine.closures.add("fetchSecurityData", (fact, context) => {
	const securityPromise = context.engine.services.securityMasterService.fetch(fact.security);
	return securityPromise.then(security => {
		fact.security = security; //replaces security with full blown object
		return fact;
	})
})

//setQuantity
engine.closures.add("setQuantity", (fact, context) => {
	fact.quantity = fact.contracts * fact.security.contractSize;
	return fact;
})

//setCost
engine.closures.add("setCost", (fact, context)  => {
	fact.cost = fact.price * fact.quantity;
	return fact;
})

//calculateCost - a version of setCost that returns not a fact but a simple value
engine.closures.add("calculateCost", (fact, context)  => {
	return fact.price * fact.quantity;
});

//setPercentualCommission
engine.closures.add("setPercentualCommission", (fact, context) => {
	fact.commissions = fact.cost * context.parameters.percentualPoints / 100;
	return fact;
}, { required: ["percentualPoints"] })

//calculateCommissions - a version of setCost that returns not a fact but a simple value
engine.closures.add("calculatePercentualCommission", (fact, context) => {
	return fact.cost * context.parameters.percentualPoints / 100;
}, { required: ["percentualPoints"] })

module.exports = engine;
