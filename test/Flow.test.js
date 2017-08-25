"use strict";

const chai = require("chai"),
	Engine = require("../lib/Engine"),
	actions = require("../actions"),
	conditions = require("../conditions");

chai.should();

describe("Flow", () => {

	const engine = new Engine();
	let flow;

	before(() => {
		engine.context.commissionService = {
			calculateCommissions(value) {
				return Promise.resolve(value * 0.01);
			}
		}
	});

	beforeEach("create flow", () => {
		const Side = require("./conditions/Side.condition");
		const CalculateCommissions = require("./actions/CalculateCommissions.action");
		const CalculateCost = require("./actions/CalculateCost.action");

		flow = engine.createFlow();
		flow.addRule({
			condition: Side.instantiate({ name: "Side", expectedSide: "buy" }),
			action: [
				CalculateCommissions.instantiate({ name: "CalculateCommissions" }),
				CalculateCost.instantiate({ name: "CalculateCost" })
			]
		});

		flow.addRule({
			condition: Side.instantiate({ name: "Side", expectedSide: "sell" }),
			action: actions.FixedValue.instantiate({ name: "FixedValue", field: "cost", value: 10 })
		});

		flow.addRule({
			condition: Side.instantiate({ name: "Side", expectedSide: "sell" }),
			action: actions.FixedValue.instantiate({ name: "FixedValue", field: "cost", value: 10 })
		});

		flow.addRule({
			condition: conditions.MatchAll.instantiate({ name: "MatchAll" }),
			action: actions.FixedValue.instantiate({ name: "FixedValue", field: "cost", value: 9999 })
		});
	});

	describe("Non addition flow", () => {

		beforeEach(() => {
			flow.rulesAddition = false;
		});

		it("should process single action rule", () => {
			const result = flow.process(createFact({ side: "sell", price: 20, quantity: 5 }));
			return result.should.eventually.have.property("model").that.has.property("cost", 10);
		});

		it("should process multiple action rule", () => {
			const result = flow.process(createFact({ side: "buy", price: 20, quantity: 5 }));
			return result.should.eventually.have.property("model").that.has.property("cost", 101);
		});

	});

	describe("Addition flow", () => {

		beforeEach(() => {
			flow.rulesAddition = true;
		});

		it("should process single action rule", () => {
			const result = flow.process(createFact({ side: "sell", price: 20, quantity: 5 }));
			return result.should.eventually.have.property("model").that.has.property("cost", 9999);
		});

		it("should process multiple action rule", () => {
			const result = flow.process(createFact({ side: "buy", price: 20, quantity: 5 }));
			return result.should.eventually.have.property("model").that.has.property("cost", 9999);
		});

	});

});


function createFact(model) {
	return { model };
}
