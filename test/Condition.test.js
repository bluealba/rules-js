"use strict";

const chai = require("chai");

chai.should();

describe("Condition", () => {

	describe("Parameterless condition", () => {
		const BuySide = require("./conditions/BuySide.condition")

		it("evaluate should return true when fact is buy", () => {
			const condition = BuySide.instantiate({ name: "BuySide" }); //name is not really needed, but definition will have it
			const fact = createFact({ side: "buy" });
			condition.evaluate(fact).should.be.ok;
		});

		it("evaluate should return true when fact is other", () => {
			const condition = BuySide.instantiate({ name: "BuySide" });
			const fact = createFact({ side: "sell" });
			condition.evaluate(fact).should.be.not.ok;
		});

	});

	describe("Parameterized condition", () => {
		const Side = require("./conditions/Side.condition")

		it("evaluate should return true when fact is buy", () => {
			const condition = Side.instantiate({ name: "Side", expectedSide: "buy" });
			const fact = createFact({ side: "buy" });
			condition.evaluate(fact).should.be.ok;
		});

		it("evaluate should return true when fact is other", () => {
			const condition = Side.instantiate({ name: "Side", expectedSide: "buy" });
			const fact = createFact({ side: "sell" });
			condition.evaluate(fact).should.be.not.ok;
		});

	});

	describe("Incomplete condition", () => {
		const Incomplete = require("./conditions/Incomplete.condition")

		it("evaluate should throw an error", () => {
			const condition = Incomplete.instantiate({ name: "Incomplete" });
			const fact = createFact({ side: "buy" });
			(() => condition.evaluate(fact)).should.throw();
		});

	});

	describe("Abstract condition", () => {
		const Condition = require("../lib/Condition")

		it("evaluate should throw an error", () => {
			const condition = Condition.instantiate({ name: "Condition" });
			const fact = createFact({ side: "buy" });
			(() => condition.evaluate(fact)).should.throw();
		});

	});

});


function createFact(model) {
	return { model };
}
