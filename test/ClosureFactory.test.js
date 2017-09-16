"use strict";

const chai = require("chai"),
	Engine = require("../lib/Engine"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

const trueFn = () => true

describe("ClosureFactory", () => {

	let engine

	beforeEach(() => {
		engine = new Engine();
	});

	describe("addNamedClosure", () => {

		it("should fail if an closure with the given name is already defined", () => {
			engine.closures.addProvidedClosureImpl("true", trueFn);
			(() => engine.closures.addProvidedClosureImpl("true", trueFn)).should.throw();
		});

		it("should fail if an closure is not a function", () => {
			(() => engine.closures.addProvidedClosureImpl("true", "something")).should.throw();
		});

	});

	describe("createProvidedClosure()", () => {

		it("shouldn't do any validation for parameterless closures", () => {
			engine.closures.addProvidedClosureImpl("true", trueFn);
			engine.closures.createProvidedClosure("true"); //does nothing
		});

		it("shouln't fail if required parmeters are provided ", () => {
			engine.closures.addProvidedClosureImpl("equal", trueFn, { requiredParameters: ["field", "value"] });
			engine.closures.createProvidedClosure({ "closure": "equal", "field": "foo", "value": "bar" });
		});

		it("should fail if implementation does not exists", () => {
			(() => engine.closures.createProvidedClosure("true")).should.throw();
		});

		it("should fail if any of required parameters is missing", () => {
			engine.closures.addProvidedClosureImpl("equal", trueFn, { requiredParameters: ["field", "value"] });
			(() => engine.closures.createProvidedClosure({ "closure": "equal", "field": "foo" })).should.throw();
		});

	});

});
