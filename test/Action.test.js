"use strict";

const chai = require("chai"),
	chaiPromised = require("chai-as-promised"),
	Engine = require("../lib/Engine")

chai.use(chaiPromised);
chai.should();

describe("Action", () => {

	describe("Parameterless async action", () => {
		const CalculateCommissions = require("./actions/CalculateCommissions.action")
		const engine = new Engine();

		before(() => {
			engine.context.commissionService = {
				calculateCommissions(value) {
					return Promise.resolve(value * 0.01);
				}
			}
		});

		it("perform should eventually resolve to a commission value", () => {
			const action = CalculateCommissions.instantiate({ name: "CalculateCommissions" }); //name is not really needed, but definition will have it
			const fact = createFact({ price: 4080, quantity: 10 });
			return action.do(fact, engine).should.eventually.have.property("model")
				.that.has.property("commissions", 408);
		});

	});

	describe("Parameterless sync action", () => {
		const CalculateCost = require("./actions/CalculateCost.action");
		const engine = new Engine();

		it("perform should eventually resolve to a commission value", () => {
			const action = CalculateCost.instantiate({ name: "CalculateCost" }); //name is not really needed, but definition will have it
			const fact = createFact({ price: 4080, quantity: 10, commissions: 100 });
			return action.do(fact, engine).should.eventually.have.property("model")
				.that.has.property("cost", 40900);
		});

	});

	describe("Parameterless fact changing action", () => {
		const FactChanging = require("./actions/FactChanging.action");
		const engine = new Engine();

		it("perform should eventually resolve to a commission value", () => {
			const action = FactChanging.instantiate({ name: "FactChanging" }); //name is not really needed, but definition will have it
			const fact = createFact({ price: 4080, quantity: 10 });
			return action.do(fact, engine).should.eventually.have.property("newFact", true);
		});

	});

	describe("Abstract action", () => {
		const Action = require("../lib/Action");
		const engine = new Engine();

		it("perform should throw an error", () => {
			const action = Action.instantiate({ name: "Action" });
			const fact = createFact({ side: "buy" });
			(() => action.do(fact, engine)).should.throw();
		});

	});


});


function createFact(model) {
	return { model };
}
