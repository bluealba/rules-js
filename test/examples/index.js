"use strict";

const	Engine = require("../../lib/Engine"),
	commonConditions = require("../../lib/condition/common"),
	commonActions = require("../../lib/action/common");

module.exports = rulesFile => {
	const engine = new Engine();
	commonConditions(engine);
	commonActions(engine);

	//productTypeCondition - not really needed, generic equal can be used instead
	engine.addNamedClosure("productTypeCondition", (fact, {productType}) => fact.model.productType === productType);

	//calculateQuantity
	engine.addNamedClosure("fetchSecurityData", (fact, params, engine) => {
		const securityPromise = engine.context.securityMasterSevice.fetch(fact.model.security);
		return securityPromise.then(security => {
			fact.model.security = security; //replaces security with full blown object
			return fact;
		})
	})

	//calculateQuantity
	engine.addNamedClosure("calculateQuantity", fact => {
		fact.model.quantity = fact.model.contracts * fact.model.security.contractSize;
		return fact;
	})

	//calculateCost
	engine.addNamedClosure("calculateCost", fact => {
		fact.model.cost = fact.model.price * fact.model.quantity;
		return fact;
	})

	//setPercentualCommission
	engine.addNamedClosure("setPercentualCommission", (fact, {percentualPoints}) => {
		fact.model.commissions = fact.model.cost * percentualPoints / 100;
		return fact;
	}, { requiredParameters: ["percentualPoints"] })

	return {
		engine,
		ruleFlow: engine.createRuleFlow(require(`./${rulesFile}.rules.json`))
	}
}
