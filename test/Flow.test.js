"use strict";

const chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

describe("RuleFlow", () => {
	let ruleFlow;

	describe("on rules that matches a certain condition should be executed", () => {
		beforeEach(() => {
			ruleFlow = require("./examples/simple-rules").ruleFlow;
		});

		it("should execute the rules that matches condition A (equities)", () => {
			const result = ruleFlow.process(createFact({ productType: "Equity", price: 20, quantity: 5 }));
			return result.should.eventually.have.property("model").that.has.property("commissions", 1);
		});

		it("should execute the rules that matches condition B (options)", () => {
			const result = ruleFlow.process(createFact({ productType: "Option", price: 20, quantity: 5 }));
			return result.should.eventually.have.property("model").that.has.property("commissions", 1.25);
		});
	});

	describe("multiple actions can be defined for a single rules", () => {
		beforeEach(() => {
			ruleFlow = require("./examples/chained-actions").ruleFlow;
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = ruleFlow.process(createFact({ productType: "Equity", price: 25, contracts: 5, security: { contractSize: 20 } }));
			return result.should.eventually.have.property("model").that.has.property("commissions", 25);
		});
	});

	describe("async actions should be resolved before moving forward with evaluation", () => {
		beforeEach(() => {
			const rules = require("./examples/async-actions");
			ruleFlow = rules.ruleFlow;

			rules.engine.context.securityMasterSevice = {
				fetch(securityId) {
					return Promise.resolve({ id: securityId, contractSize: 2})
				}
			}
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = ruleFlow.process(createFact({ productType: "Equity", price: 25, contracts: 5, security: "IBM" }));
			return result.should.eventually.have.property("model").that.has.property("commissions", 2.5);
		});
	});

});

function createFact(model) {
	return { model };
}
