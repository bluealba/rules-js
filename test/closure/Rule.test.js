"use strict";

const FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	Rule = require("../../lib/closure/Rule"),
	Context = require("../../lib/Context"),
	chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

const whenBar = new FunctionalClosure("whenBar", fact => fact === "bar");
const appendFoo = new FunctionalClosure("appendFoo", fact => fact + "foo");
const raiseError = new FunctionalClosure("appendFoo", fact => { throw new Error("expected") });

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

		it("should add itself to context.rulesFired", function* () {
			const result = yield rule.process("bar", context());
			result.context.rulesFired.should.have.lengthOf(1);
		});
	});

	describe("when condition is not met", () => {
		it("fact remains unchanged", function* () {
			const result = yield rule.process("zoo", context());
			result.should.equal("zoo");
		});

		it("shouldn't add itself to context.rulesFired", function* () {
			const result = yield rule.process("zoo", context());
			result.context.rulesFired.should.have.lengthOf(0);
		});
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

	describe("when bound to parameters", () => {
		const whenData = new FunctionalClosure("whenData", (fact, context) => fact === context.parameters.data);
		const appendData = new FunctionalClosure("appendData", (fact, context) => fact + context.parameters.suffix);

		it("they should be forwarded to inner action closure", function* () {
			rule = new Rule("rule-name", whenBar, appendData);
			rule = rule.bind(null, { suffix: "foo" })
			const result = yield rule.process("bar", context())
			result.should.equal("foobar");
		});

		it("they should be forwarded to inner condition closure", function* () {
			rule = new Rule("rule-name", whenData, appendFoo);
			rule = rule.bind(null, { data: "bar" })
			const result = yield rule.process("bar", context())
			result.should.equal("foobar");
		});
	});

	it("should fail when built without action", () => {
		(() => new Rule("rule-name", whenBar, undefined)).should.throw();
	});

	it("should fail when built without condition", () => {
		(() => new Rule("rule-name", undefined, appendFoo)).should.throw();
	});
});

function context() {
	return new Context();
}
