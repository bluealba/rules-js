"use strict";

const	Engine = require("../../lib/Engine"),
	commonConditions = require("../../lib/condition/common");

const engine = new Engine();
commonConditions(engine);

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
	ruleFlow: engine.createRuleFlow(require("./simple-rules.rules.json"))
}
