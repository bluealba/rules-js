"use strict";

const chai = require("chai"),
	engine = require("./flows"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

function createRuleFlow(name) {
	engine.add(require(`./flows/${name}.flow.json`), { override: true });
}

describe("Engine", () => {

	beforeEach(() => {
		engine.context.securityMasterSevice = {
			fetch(securityId) {
				return Promise.resolve({ id: securityId, contractSize: 2})
			}
		}
	});

	describe("rules that matches a certain condition should be executed", () => {
		beforeEach(() => {
			createRuleFlow("simple-rules");
		});

		it("should execute the rules that matches condition A (equities)", () => {
			const result = engine.process("simple-rules", { productType: "Equity", price: 20, quantity: 5 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1);
		});

		it("should execute the rules that matches condition B (options)", () => {
			const result = engine.process("simple-rules", { productType: "Option", price: 20, quantity: 5 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.25);
		});
	});

	describe("multiple actions can be defined for a single rules", () => {
		beforeEach(() => {
			createRuleFlow("chained-actions");
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = engine.process("chained-actions", { productType: "Equity", price: 25, contracts: 5, security: { contractSize: 20 } });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 25);
		});
	});

	describe("async actions should be resolved before moving forward with evaluation", () => {
		beforeEach(() => {
			createRuleFlow("async-actions");
		});

		it("should execute all the actions for the rule, in order", () => {
			const result = engine.process("async-actions", { productType: "Equity", price: 25, contracts: 5, security: "IBM" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 2.5);
		});
	});

	describe("nested rule flow can be defined as action of a single rule", () => {
		beforeEach(() => {
			createRuleFlow("nested-rules");
		});

		it("should execute the rules that matches condition B.A (call options)", () => {
			const result = engine.process("nested-rules", { productType: "Option", price: 20, quantity: 5, optionType: "Call" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.1);
		});

		it("should execute the rules that matches condition B.B (put options)", () => {
			const result = engine.process("nested-rules", { productType: "Option", price: 20, quantity: 5, optionType: "Put" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 0.9);
		});
	});

	describe("default should be local to nested flow", () => {
		beforeEach(() => {
			createRuleFlow("default-condition");
		});

		it("should execute the rules that matches condition B.A (call options)", () => {
			const result = engine.process("default-condition", { productType: "Option", price: 20, quantity: 5, optionType: "Call" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.1);
		});

		it("should execute the default rule", () => {
			const result = engine.process("default-condition", { productType: "Option", price: 20, quantity: 5, optionType: "Other" });
			return result.should.be.rejectedWith(Error, "Unrecognized optionType");
		});
	});

	describe("a rule can have parameters that are other closures!", () => {
		beforeEach(() => {
			createRuleFlow("generic-set-rule");
		});

		it("inner closures are executed properly by rules", () => {
			const result = engine.process("generic-set-rule", { productType: "Option", price: 20, quantity: 5 });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 1.25);
		});
	});

	describe("a parameterless closure can be defined as a string", () => {
		beforeEach(() => {
			createRuleFlow("sugar-coated");
		});

		it("inner closures are executed properly by rules", () => {
			const result = engine.process("sugar-coated", { productType: "Equity", price: 25, contracts: 5, security: "IBM" });
			return result.should.eventually.have.property("fact").that.has.property("commissions", 2.5);
		});
	});

	describe("a date-ranged closure executed", () => {
		beforeEach(() => {
			createRuleFlow("date-ranged-rules");
		});

		it(" for a fact inside the specified range inner closures are executed properly by rules", () => {
			const result = engine.process("date-ranged-rules", { productType: "Equity", price: 20, quantity: 5, date: "2017-01-28" });
			return result.should.eventually.have.property("fact").that.has.property("cost", 100);
		});

		it(" for a fact outside the specified range inner closures are not executed", () => {
			const result = engine.process("date-ranged-rules", { productType: "Equity", price: 20, quantity: 5, date: "2017-01-31" });
			return result.should.eventually.have.property("fact").that.has.not.property("cost");
		});
	});

});
