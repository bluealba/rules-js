"use strict";

const chai = require("chai"),
	engine = require("./rules"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

function createRuleFlow(name) {
	return engine.closures.create(require(`./rules/${name}.rules.json`));
}

describe("RuleFlow", () => {
	let ruleFlow;

	beforeEach(() => {
		//TODO: this should be part of context!
		engine.context.securityMasterSevice = {
			fetch(securityId) {
				return Promise.resolve({ id: securityId, contractSize: 2})
			}
		}
	});

	describe("rules that matches a certain condition should be executed", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("simple-rules");
		});

		it("should execute the rules that matches condition A (equities)", () => {
			const result = engine.process(ruleFlow, { productType: "Equity", price: 20, quantity: 5 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1);
		});

		it("should execute the rules that matches condition B (options)", () => {
			const result = engine.process(ruleFlow, { productType: "Option", price: 20, quantity: 5 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.25);
		});
	});

	describe("multiple actions can be defined for a single rules", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("chained-actions");
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = engine.process(ruleFlow, { productType: "Equity", price: 25, contracts: 5, security: { contractSize: 20 } });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 25);
		});
	});

	describe("async actions should be resolved before moving forward with evaluation", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("async-actions");
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = engine.process(ruleFlow, { productType: "Equity", price: 25, contracts: 5, security: "IBM" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 2.5);
		});
	});

	describe("nested rule flow can be defined as action of a single rule", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("nested-rules");
		});

		it("should execute the rules that matches condition B.A (call options)", () => {
			const result = engine.process(ruleFlow, { productType: "Option", price: 20, quantity: 5, optionType: "Call" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.1);
		});

		it("should execute the rules that matches condition B.B (put options)", () => {
			const result = engine.process(ruleFlow, { productType: "Option", price: 20, quantity: 5, optionType: "Put" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 0.9);
		});
	});

	describe("default action should be invoked if no rule evaluates before it", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("default-rule");
		});

		it("should execute the rules that matches condition A (equities)", () => {
			const result = engine.process(ruleFlow, { productType: "Equity", cost: 100 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1);
		});

		it("should execute default rule", () => {
			const result = engine.process(ruleFlow, { productType: "Other" });
			return result.should.be.rejectedWith(Error, "Unrecognized product");
		});
	});

	describe("default should be local to nested flow", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("nested-rules-with-default");
		});

		it("should execute the rules that matches condition B.A (call options)", () => {
			const result = engine.process(ruleFlow, { productType: "Option", price: 20, quantity: 5, optionType: "Call" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.1);
		});

		it("should execute the default rule", () => {
			const result = engine.process(ruleFlow, { productType: "Option", price: 20, quantity: 5, optionType: "Other" });
			return result.should.be.rejectedWith(Error, "Unrecognized optionType");
		});
	});

	describe("a rule can have parameters that are other closures!", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("generic-set-rule");
		});

		it("inner closures are executed properly by rules", () => {
			const result = engine.process(ruleFlow, { productType: "Option", price: 20, quantity: 5 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.25);
		});
	});

	describe("a parameterless closure can be defined as a string", () => {
		beforeEach(() => {
			ruleFlow = createRuleFlow("sugar-coated");
		});

		it("inner closures are executed properly by rules", () => {
			const result = engine.process(ruleFlow, { productType: "Equity", price: 25, contracts: 5, security: "IBM" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 2.5);
		});
	});

});
