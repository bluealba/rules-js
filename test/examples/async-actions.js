"use strict";

const	Engine = require("../../lib/Engine"),
	commonConditions = require("../../lib/condition/common");

const engine = new Engine();
commonConditions(engine);

//calculateQuantity
engine.addImplementor("fetchSecurityData", (fact, params, engine) => {
	const securityPromise = engine.context.securityMasterSevice.fetch(fact.model.security);
	return securityPromise.then(security => {
		fact.model.security = security; //replaces security with full blown object
		return fact;
	})
})

//calculateQuantity
engine.addImplementor("calculateQuantity", fact => {
	fact.model.quantity = fact.model.contracts * fact.model.security.contractSize;
	return fact;
})

//calculateCost
engine.addImplementor("calculateCost", fact => {
	fact.model.cost = fact.model.price * fact.model.quantity;
	return fact;
})

//productTypeCondition
engine.addImplementor("productTypeCondition", (fact, {productType}) => fact.model.productType === productType);

//setPercentualCommission
engine.addImplementor("setPercentualCommission", (fact, {percentualPoints}) => {
	fact.model.commissions = fact.model.cost * percentualPoints / 100;
	return fact;
})

module.exports = {
	engine,
	ruleFlow: engine.createRuleFlow(require("./async-actions.rules.json"))
}