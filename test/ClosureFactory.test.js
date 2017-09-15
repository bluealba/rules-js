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
			engine.closures.addNamedClosureImpl("true", trueFn);
			(() => engine.closures.addNamedClosureImpl("true", trueFn)).should.throw();
		});

		it("should fail if an closure is not a function", () => {
			(() => engine.closures.addNamedClosureImpl("true", "something")).should.throw();
		});

		it("should register closure function and validator", () => {
			engine.closures.addNamedClosureImpl("true", trueFn);

			engine.closures.getNamedClosureImpl("true").should.have.property("fn").that.is.a("function");
			engine.closures.getNamedClosureImpl("true").should.have.property("fn").that.equals(trueFn);

			engine.closures.getNamedClosureImpl("true").should.have.property("validator").that.is.a("function");
		});

	});

	describe("getNamedClosureImpl().validator", () => {

		it("should do nothing for not paremeterized closures", () => {
			engine.closures.addNamedClosureImpl("true", trueFn);
			engine.closures.getNamedClosureImpl("true").validator({}); //does nothing
		});

		it("should do nothing if required parameters are provided", () => {
			engine.closures.addNamedClosureImpl("true", trueFn, { requiredParameters: ["field", "value"] });
			engine.closures.getNamedClosureImpl("true").validator({
				field: "foo",
				value: "bar"
			});
		});

		it("should fail if implementation does not exists", () => {
			(() => engine.closures.getNamedClosureImpl("true")).should.throw();
		});

		it("should fail if any of required parameters is missing", () => {
			engine.closures.addNamedClosureImpl("true", trueFn, { requiredParameters: ["field", "name"] });
			(() => engine.closures.getNamedClosureImpl("true").validator({ field: "foo" })).should.throw();
		});

	});

});
