"use strict";

const chai = require("chai"),
	Engine = require("../lib/Engine"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

const trueFn = () => true

describe("Engine", () => {

	describe("addNamedClosure", () => {

		it("should fail if an closure with the given name is already defined", () => {
			const engine = new Engine();
			engine.addNamedClosure("true", trueFn);
			(() => engine.addNamedClosure("true", trueFn)).should.throw();
		});

		it("should fail if an closure is not a function", () => {
			const engine = new Engine();
			(() => engine.addNamedClosure("true", "something")).should.throw();
		});

		it("should register closure function and validator", () => {
			const engine = new Engine();
			engine.addNamedClosure("true", trueFn);

			engine.getNamedClosure("true").should.have.property("fn").that.is.a("function");
			engine.getNamedClosure("true").should.have.property("fn").that.equals(trueFn);

			engine.getNamedClosure("true").should.have.property("validator").that.is.a("function");
		});

	});

	describe("getNamedClosure().validator", () => {

		it("should do nothing for not paremeterized closures", () => {
			const engine = new Engine();
			engine.addNamedClosure("true", trueFn);
			engine.getNamedClosure("true").validator({}); //does nothing
		});

		it("should do nothing if required parameters are provided", () => {
			const engine = new Engine();
			engine.addNamedClosure("true", trueFn, { requiredParameters: ["field", "value"] });
			engine.getNamedClosure("true").validator({
				field: "foo",
				value: "bar"
			});
		});

		it("should fail if any of required parameters is missing", () => {
			const engine = new Engine();
			engine.addNamedClosure("true", trueFn, { requiredParameters: ["field", "name"] });
			(() => engine.getNamedClosure("true").validator({ field: "foo" })).should.throw();
		});

	});

});
