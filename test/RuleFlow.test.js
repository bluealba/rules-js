"use strict";

const chai = require("chai"),
	factory = require("./examples"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

describe("RuleFlow", () => {
	let ruleFlow;

	describe("rules that matches a certain condition should be executed", () => {
		beforeEach(() => {
			ruleFlow = factory("simple-rules").ruleFlow;
		});

		it("should execute the rules that matches condition A (equities)", () => {
			const result = ruleFlow.process({ productType: "Equity", price: 20, quantity: 5 });
			return result.should.eventually.have.property("model").that.has.property("commissions", 1);
		});

		it("should execute the rules that matches condition B (options)", () => {
			const result = ruleFlow.process({ productType: "Option", price: 20, quantity: 5 });
			return result.should.eventually.have.property("model").that.has.property("commissions", 1.25);
		});
	});

	describe("multiple actions can be defined for a single rules", () => {
		beforeEach(() => {
			ruleFlow = factory("chained-actions").ruleFlow;
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = ruleFlow.process({ productType: "Equity", price: 25, contracts: 5, security: { contractSize: 20 } });
			return result.should.eventually.have.property("model").that.has.property("commissions", 25);
		});
	});

	describe("async actions should be resolved before moving forward with evaluation", () => {
		beforeEach(() => {
			const rules = factory("async-actions");
			ruleFlow = rules.ruleFlow;

			rules.engine.context.securityMasterSevice = {
				fetch(securityId) {
					return Promise.resolve({ id: securityId, contractSize: 2})
				}
			}
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = ruleFlow.process({ productType: "Equity", price: 25, contracts: 5, security: "IBM" });
			return result.should.eventually.have.property("model").that.has.property("commissions", 2.5);
		});
	});

	describe("nested rule flow can be defined as action of a single rule", () => {
		beforeEach(() => {
			ruleFlow = factory("nested-rules").ruleFlow;
		});

		it("should execute the rules that matches condition B.A (call options)", () => {
			const result = ruleFlow.process({ productType: "Option", price: 20, quantity: 5, optionType: "Call" });
			return result.should.eventually.have.property("model").that.has.property("commissions", 1.1);
		});

		it("should execute the rules that matches condition B.B (put options)", () => {
			const result = ruleFlow.process({ productType: "Option", price: 20, quantity: 5, optionType: "Put" });
			return result.should.eventually.have.property("model").that.has.property("commissions", 0.9);
		});
	});

	describe("default action should be invoked if no rule evaluates before it", () => {
		beforeEach(() => {
			ruleFlow = factory("default-rule").ruleFlow;
		});

		it("should execute the rules that matches condition A (equities)", () => {
			const result = ruleFlow.process({ productType: "Equity", cost: 100 });
			return result.should.eventually.have.property("model").that.has.property("commissions", 1);
		});

		it("should execute default rule", () => {
			const result = ruleFlow.process({ productType: "Other" });
			return result.should.be.rejectedWith(Error, "Unrecognized product");
		});
	});

	describe("default should be local to nested flow", () => {
		beforeEach(() => {
			ruleFlow = factory("nested-rules-with-default").ruleFlow;
		});

		it("should execute the rules that matches condition B.A (call options)", () => {
			const result = ruleFlow.process({ productType: "Option", price: 20, quantity: 5, optionType: "Call" });
			return result.should.eventually.have.property("model").that.has.property("commissions", 1.1);
		});

		it("should execute the default rule", () => {
			const result = ruleFlow.process({ productType: "Option", price: 20, quantity: 5, optionType: "Other" });
			return result.should.be.rejectedWith(Error, "Unrecognized optionType");
		});


	});

});
