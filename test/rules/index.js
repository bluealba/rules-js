"use strict";

const	Engine = require("../../lib/Engine"),
	commmons = require("../../lib/common");

const engine = new Engine();
commmons(engine);

//productTypeCondition - not really needed, generic equal can be used instead
engine.addNamedClosure("productTypeCondition", (fact, {productType}) => fact.productType === productType);

//setQuantity
engine.addNamedClosure("fetchSecurityData", (fact, params, context) => {
	const securityPromise = context.engine.context.securityMasterSevice.fetch(fact.security);
	return securityPromise.then(security => {
		fact.security = security; //replaces security with full blown object
		return fact;
	})
})

//setQuantity
engine.addNamedClosure("setQuantity", fact => {
	fact.quantity = fact.contracts * fact.security.contractSize;
	return fact;
})

//setCost
engine.addNamedClosure("setCost", fact => {
	fact.cost = fact.price * fact.quantity;
	return fact;
})

//calculateCost - a version of setCost that returns not a fact but a simple value
engine.addNamedClosure("calculateCost", fact => fact.price * fact.quantity);

//setPercentualCommission
engine.addNamedClosure("setPercentualCommission", (fact, {percentualPoints}) => {
	fact.commissions = fact.cost * percentualPoints / 100;
	return fact;
}, { requiredParameters: ["percentualPoints"] })

//calculateCommissions - a version of setCost that returns not a fact but a simple value
engine.addNamedClosure("calculatePercentualCommission", (fact, {percentualPoints}) => fact.cost * percentualPoints / 100,
	{ requiredParameters: ["percentualPoints"] })

module.exports = {
	engine,

	createRuleFlow(rulesFile) {
		return engine.createRuleFlow(require(`./${rulesFile}.rules.json`))
	}
}
