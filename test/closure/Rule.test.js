"use strict";

const ProvidedClosure = require("../../lib/closure/ProvidedClosure"),
	Rule = require("../../lib/closure/Rule"),
	Context = require("../../lib/Context"),
	chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

const whenBar = new ProvidedClosure("whenBar", fact => fact === "bar");
const appendFoo = new ProvidedClosure("appendFoo", fact => fact + "foo");
const raiseError = new ProvidedClosure("appendFoo", fact => { throw new Error("expected") });

describe("Rule", () => {
	let rule;

	beforeEach(() => {
		rule = new Rule("rule-name", whenBar, appendFoo);
	});

	it("has a name", () => {
		rule.should.have.property("name", "rule-name");
	});

	it("has action and condition closures", () => {
		rule.should.have.property("action").that.has.property("process").that.is.a("function");
		rule.should.have.property("condition").that.has.property("process").that.is.a("function");
	});

	describe("when condition is met", () => {
		it("can be invoked and return the new fact", function* () {
			const result = yield rule.process("bar", context());
			result.should.equal("barfoo");
		});

		it.skip("should add itself to context.rulesFired");
	});

	describe("when condition is not met", () => {
		it("fact remains unchanged", function* () {
			const result = yield rule.process("zoo", context());
			result.should.equal("zoo");
		});

		it.skip("shouldn't add itself to context.rulesFired");
	});

	describe("when action raises an error", () => {
		beforeEach(() => {
			rule = new Rule("rule-name", whenBar, raiseError);
		});

		it("error gets propagated", () => {
			return rule.process("bar", context()).should.be.rejected;
		});
	});

	describe("when condition raises an error", () => {
		beforeEach(() => {
			rule = new Rule("rule-name", raiseError, appendFoo);
		});

		it("error gets propagated", () => {
			return rule.process("bar", context()).should.be.rejected;
		});
	});

	it.skip("should fail when built without action");
	it.skip("should fail when built without condition");
});

function context() {
	return new Context();
}
