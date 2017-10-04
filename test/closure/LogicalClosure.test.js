"use strict";
const LogicalClosure = require("../../lib/closure/LogicalClosure"),
	FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

describe("LogicalClosure", () => {

	it("should have name", () => {
		let first = new FunctionalClosure("true", fact => true);
		let second = new FunctionalClosure("true", fact => true);
		let closure = new LogicalClosure("some-closure", "AND", first, second);
		closure.should.have.property("name").equal("some-closure");
	});

	it("should have operator", () => {
		let first = new FunctionalClosure("true", fact => true);
		let second = new FunctionalClosure("true", fact => true);
		let closure = new LogicalClosure("some-closure", "AND", first, second);
		closure.should.have.property("operator").equal("AND");
	});

	it("should have first operand", () => {
		let first = new FunctionalClosure("true", fact => true);
		let second = new FunctionalClosure("true", fact => true);
		let closure = new LogicalClosure("some-closure", "AND", first, second);
		closure.should.have.property("first").equal(first);
	});

	it("should have second operand", () => {
		let first = new FunctionalClosure("true", fact => true);
		let second = new FunctionalClosure("true", fact => true);
		let closure = new LogicalClosure("some-closure", "AND", first, second);
		closure.should.have.property("second").equal(second);
	});

	describe("For AND operator", () => {

		it("should be true when both operands are true", function * () {
			let first = new FunctionalClosure("true", fact => true);
			let second = new FunctionalClosure("true", fact => true);
			let closure = new LogicalClosure("some-closure", "AND", first, second);

			let fact = {};
			let context = {};

			let result = yield closure.process(fact, context);

			console.log("Result: " + result);

			result.should.be.true;
		});

		it("should be false when one operand is false", function * () {
			let first = new FunctionalClosure("false", fact => false);
			let second = new FunctionalClosure("true", fact => true);
			let closure = new LogicalClosure("some-closure", "AND", first, second);

			let fact = {};
			let context = {};

			let result = yield closure.process(fact, context);

			result.should.be.false;
		});

		it("should be false when both operands are false", function * () {
			let first = new FunctionalClosure("false", fact => false);
			let second = new FunctionalClosure("false", fact => false);
			let closure = new LogicalClosure("some-closure", "AND", first, second);

			let fact = {};
			let context = {};

			let result = yield closure.process(fact, context);

			result.should.be.false;
		});

	});

});
