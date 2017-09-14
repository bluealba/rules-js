"use strict";

const chai = require("chai"),
	Engine = require("../lib/Engine"),
	Rule = require("../lib/Rule"),
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

	describe("simple rules", () => {

		let rule;

		beforeEach(() => {
			engine.addNamedClosure("setFoo", fact => {
				fact.foo = "foo";
				return fact;
			});

			const json = {
				"name": "rule-name",
				"when": "always",
				"then": "setFoo"
			};
			rule = Rule.create(engine, json);
		});

		it("rule with parameterless condition/action can be defined through plain string syntax", () => {
			rule.should.have.property("action");
			rule.should.have.property("condition");
			rule.should.have.property("name", "rule-name");
		});

		it("rule action can be invoked and return a with modified fact", () => {
			const result = engine.process(rule, { "bar": "bar" });
			return result.should.eventually.have.property("fact").eql({
				foo: "foo",
				bar: "bar"
			});
		});

	})

});