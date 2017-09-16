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
			engine.closures.addProvidedClosureImpl("setFoo", fact => {
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
			engine.closures.addProvidedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": { "closure": "equal", "field": "testField", "value": true },
				"then": { "closure": "setFoo", "value": 12345 }
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
			engine.closures.addProvidedClosureImpl("newFact", (fact, parameters) => {
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

	describe("rule with array of rules (reducer) on action", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addProvidedClosureImpl("extractBodyField", fact => {
				return fact.body; //extracts the body out of the fact
			});

			engine.closures.addProvidedClosureImpl("newFact", (fact, parameters) => {
				return fact + parameters.value; //concatenates fact value with parameter value
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": "always",
				"then": [
					"extractBodyField", //can mix both parameterless and regular syntax
					{ "closure": "newFact", "value": "bar" }
				]
			};
			rule = engine.closures.create(json);
		});

		it("can be invoked and return the new fact, reduced from the list of closures", () => {
			const result = engine.process(rule, { body: "foo" });
			return result.should.eventually.have.property("fact").eql("foobar");
		});
	});

	describe("rule with array of rules (reducer) on condition", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addProvidedClosureImpl("extractTestField", fact => {
				return fact.testField; //extracts the testField out of the fact, it becomes the new fact!
			});

			engine.closures.addProvidedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": [
					"extractTestField",
					{ "closure": "equal", "value": 10 }
				],
				"then": { "closure": "setFoo", "value": "foo" }
			};
			rule = engine.closures.create(json);
		});

		it("executes action if reduced condition is met", () => {
			const result = engine.process(rule, { bar: "bar", testField: 10 });
			return result.should.eventually.have.property("fact").eql({
				foo: "foo",
				bar: "bar",
				testField: 10
			});
		});

		it("won't execute action if reduced condition is not met", () => {
			const result = engine.process(rule, { bar: "bar", testField: 0 });
			return result.should.eventually.have.property("fact").eql({
				bar: "bar",
				testField: 0
			});
		});
	});


	//wtf is this scenario, it works but it seems weird. It might be a way to
	//achieve logical grouping of conditions but it doesn't seem right
	describe("rule with another rule as action", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addProvidedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": { "closure": "equal", "field": "testField1", "value": 10 },
				"then": {
					"name": "inner-rule-name",
					"when": { "closure": "equal", "field": "testField2", "value": 20 },
					"then": { "closure": "setFoo", "value": "foo" }
				}
			};
			rule = engine.closures.create(json);
		});

		it("executes inner-action if both conditions are met", () => {
			const result = engine.process(rule, { bar: "bar", testField1: 10, testField2: 20 });
			return result.should.eventually.have.property("fact").eql({
				foo: "foo",
				bar: "bar",
				testField1: 10,
				testField2: 20
			});
		});

		it("won't execute action if inner condition is not met", () => {
			const result = engine.process(rule, { bar: "bar", testField1: 10, testField2: 0 });
			return result.should.eventually.have.property("fact").eql({
				bar: "bar",
				testField1: 10,
				testField2: 0
			});
		});

		it("won't execute action if outer condition is not met", () => {
			const result = engine.process(rule, { bar: "bar", testField1: 0, testField2: 20 });
			return result.should.eventually.have.property("fact").eql({
				bar: "bar",
				testField1: 0,
				testField2: 20
			});
		});
	});

	describe("rule with a rule-flow as an action", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addProvidedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": { "closure": "equal", "field": "testField1", "value": 10 },
				"then": {
					"name": "inner-rule-flow",
					"rules": [
						{
							"name": "on-1",
							"when": { "closure": "equal", "field": "testField2", "value": 1 },
							"then": { "closure": "setFoo", "value": "on-1-executed" }
						},
						{
							"name": "on-2",
							"when": { "closure": "equal", "field": "testField2", "value": 2 },
							"then": { "closure": "setFoo", "value": "on-2-executed" }
						},
						{
							"name": "on-other",
							"when": "default",
							"then": { "closure": "setFoo", "value": "on-default-executed" }
						}
					]
				}
			};
			rule = engine.closures.create(json);
		});

		it("executes inner ruleFlow if condition is met", () => {
			const result = engine.process(rule, { testField1: 10, testField2: 2 });
			return result.should.eventually.have.property("fact").eql({
				foo: "on-2-executed",
				testField1: 10,
				testField2: 2
			});
		});

		it("executes inner ruleFlow if condition is met, default condition is local to inner flow", () => {
			const result = engine.process(rule, { testField1: 10, testField2: 7 });
			return result.should.eventually.have.property("fact").eql({
				foo: "on-default-executed",
				testField1: 10,
				testField2: 7
			});
		});

	});

	describe("rule with error", () => {
		let rule;

		beforeEach(() => {
			engine.closures.addProvidedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": "always",
				"then": {
					"name": "inner-rule-flow",
					"rules": [
						{
							"name": "do-first",
							"when": "always",
							"then": { "closure": "error", "message": "expected-error" }
						},
						{
							"name": "then-do",
							"when": "always",
							"then": { "closure": "error", "message": "this-shouldnt-be-executed!" }
						},
					]
				}
			};
			rule = engine.closures.create(json);
		});

		it("should throw the first error", () => {
			const result = engine.process(rule, {});
			return result.should.be.rejectedWith(Error, "expected-error");
		});
	});

	describe("misconfigured rules", () => {

		it("should fail if required parameter of action/condition is not provided", () => {
			engine.closures.addProvidedClosureImpl("setFoo", (fact, parameters) => {
				fact.foo = parameters.value;
				return fact;
			}, { requiredParameters: ["value"] });

			const json = {
				"name": "rule-name",
				"when": "always",
				"then": { "closure": "setFoo" }
			};
			(() => engine.closures.create(json)).should.throw();
		});

		it("should fail if action is not set", () => {
			const json = {
				"name": "rule-name",
				"when": "always"
			};
			(() => engine.closures.create(json)).should.throw();
		});

		it("should fail if condition is not set", () => {
			const json = {
				"name": "rule-name",
				"then": "identity"
			};
			(() => engine.closures.create(json)).should.throw();
		});


	});

});
