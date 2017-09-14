"use strict";

const	Engine = require("../../lib/Engine"),
	commmons = require("../../lib/common");

module.exports = rulesFile => {
	const engine = new Engine();
	commmons(engine);

	//productTypeCondition - not really needed, generic equal can be used instead
	engine.addNamedClosure("productTypeCondition", (fact, {productType}) => fact.model.productType === productType);

	//setQuantity
	engine.addNamedClosure("fetchSecurityData", (fact, params, engine) => {
		const securityPromise = engine.context.securityMasterSevice.fetch(fact.model.security);
		return securityPromise.then(security => {
			fact.model.security = security; //replaces security with full blown object
			return fact;
		})
	})

	//setQuantity
	engine.addNamedClosure("setQuantity", fact => {
		fact.model.quantity = fact.model.contracts * fact.model.security.contractSize;
		return fact;
	})

	//setCost
	engine.addNamedClosure("setCost", fact => {
		fact.model.cost = fact.model.price * fact.model.quantity;
		return fact;
	})

	//calculateCost - a version of setCost that returns not a fact but a simple value
	engine.addNamedClosure("calculateCost", fact => fact.model.price * fact.model.quantity);

	//setPercentualCommission
	engine.addNamedClosure("setPercentualCommission", (fact, {percentualPoints}) => {
		fact.model.commissions = fact.model.cost * percentualPoints / 100;
		return fact;
	}, { requiredParameters: ["percentualPoints"] })

	//calculateCommissions - a version of setCost that returns not a fact but a simple value
	engine.addNamedClosure("calculatePercentualCommission", (fact, {percentualPoints}) => fact.model.cost * percentualPoints / 100,
		{ requiredParameters: ["percentualPoints"] })


	return {
		engine,
		ruleFlow: engine.createRuleFlow(require(`./${rulesFile}.rules.json`))
	}
}
