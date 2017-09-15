"use strict";

const chai = require("chai"),
	Engine = require("../lib/Engine"),
	chaiPromised = require("chai-as-promised"),
	commmons = require("../lib/common");

chai.should();
chai.use(chaiPromised);

describe("Rule", () => {

	let engine;

	beforeEach(() => {
		engine = new Engine();
		commmons(engine); //generic conditions and actions
	});

	describe("rule with parameterless condition/action", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addNamedClosureImpl("setFoo", fact => {
				fact.foo = "foo";
				return fact;
			});

			const json = {
				"name": "rule-name",
				"when": "always",
				"then": "setFoo"
			};
			rule = engine.closures.create(json);
		});

		it("has a name", () => {
			rule.should.have.property("name", "rule-name");
		});

		it("has action and condition closures", () => {
			rule.should.have.property("action").that.has.property("process").that.is.a("function");
			rule.should.have.property("condition").that.has.property("process").that.is.a("function");
		});

		it("can be invoked and return the modified fact", () => {
			const result = engine.process(rule, { "bar": "bar" });
			return result.should.eventually.have.property("fact").eql({
				foo: "foo",
				bar: "bar"
			});
		});
	});

	describe("rule with parameters on condition/action", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addNamedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": { "closure": "equal", "field": "testField", "value": true },
				"then": { "closure": "setFoo", "value": 12345}
			};
			rule = engine.closures.create(json);
		});

		it("has a name", () => {
			rule.should.have.property("name", "rule-name");
		});

		it("has action and condition closures", () => {
			rule.should.have.property("action").that.has.property("process").that.is.a("function");
			rule.should.have.property("condition").that.has.property("process").that.is.a("function");
		});

		it("can be invoked and return the modified fact if condition is met", () => {
			const result = engine.process(rule, { "bar": "bar", "testField": true });
			return result.should.eventually.have.property("fact").eql({
				foo: 12345,
				bar: "bar",
				testField: true
			});
		});

		it("can be invoked and return the original fact if condition is not met", () => {
			const result = engine.process(rule, { "bar": "bar", "testField": false });
			return result.should.eventually.have.property("fact").eql({
				bar: "bar",
				testField: false
			});
		});
	});

	describe("fact changing rule", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addNamedClosureImpl("newFact", (fact, parameters) => {
				return fact + parameters.value; //concatenates fact value with parameter value
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": "always",
				"then": { "closure": "newFact", "value": "bar"}
			};
			rule = engine.closures.create(json);
		});

		it("can be invoked and return the new fact", () => {
			const result = engine.process(rule, "foo");
			return result.should.eventually.have.property("fact").eql("foobar");
		});

	});

});
