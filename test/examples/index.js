"use strict";

const	Engine = require("../../lib/Engine"),
	commonConditions = require("../../lib/condition/common"),
	commonActions = require("../../lib/action/common");

module.exports = rulesFile => {
	const engine = new Engine();
	commonConditions(engine);
	commonActions(engine);

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

	//optionTypeCondition
	engine.addImplementor("optionTypeCondition", (fact, {optionType}) => fact.model.optionType === optionType);

	//productTypeCondition
	engine.addImplementor("productTypeCondition", (fact, {productType}) => fact.model.productType === productType);

	//setPercentualCommission
	engine.addImplementor("setPercentualCommission", (fact, {percentualPoints}) => {
		fact.model.commissions = fact.model.cost * percentualPoints / 100;
		return fact;
	})

	return {
		engine,
		ruleFlow: engine.createRuleFlow(require(`./${rulesFile}.rules.json`))
	}
}
