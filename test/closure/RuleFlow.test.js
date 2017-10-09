"use strict";
const FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	Rule = require("../../lib/closure/Rule"),
	RuleFlow = require("../../lib/closure/RuleFlow"),
	Context = require("../../lib/Context"),
	chai = require("chai"),
	sinon = require("sinon"),
	sinonChai = require("sinon-chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);
chai.use(sinonChai);

describe("RuleFlow", () => {
	let flow;

	const noop = new Rule("rule-name", new FunctionalClosure("never", fact => false), new FunctionalClosure("appendBoo", fact => fact + "boo"));
	const appendFoo = new Rule("rule-name", new FunctionalClosure("always", fact => true), new FunctionalClosure("appendFoo", fact => fact + "foo"));
	const appendBaz = new Rule("rule-name", new FunctionalClosure("always", fact => true), new FunctionalClosure("appendBaz", fact => fact + "baz"));
	const appendZoo = new Rule("rule-name", new FunctionalClosure("always", fact => true), new FunctionalClosure("appendZoo", fact => fact + "zoo"));
	const raiseError = new FunctionalClosure("raise", fact => { throw new Error("expected") });

	beforeEach(() => {
		flow = new RuleFlow("flow-name", [noop, appendFoo, appendBaz, appendZoo]);
	});

	it("should have name", () => {
		flow.name.should.equal("flow-name");
	})

	it("should reduce the provided fact across the whole chain of closures", function* () {
		const result = yield flow.process("bar", context());
		result.fact.should.be.equal("bar" + "foo" + "baz" + "zoo");
	})

	it("should short circuit if match once is activated", function* () {
		flow.options.matchOnce = true;
		const result = yield flow.process("bar", context());
		result.fact.should.be.equal("bar" + "foo");
	})

	it("should notify context of start / end of the flow", function* () {
		const result = yield flow.process("bar", context());
		result.context.initiateFlow.should.habe.been.calledOnce();
		result.context.endFlow.should.habe.been.calledOnce();
	})

	it("should propagate the error if any closure in the chain fails", () => {
		flow = new RuleFlow("flow-name", [appendFoo, raiseError, appendZoo]);
		return flow.process("bar", context()).should.be.rejected;
	})

	describe("when bound to parameters", () => {
		const appendSuffix = new FunctionalClosure("appendSuffix", (fact, context) => fact + context.parameters.suffix);

		it("parameters should be propagated to all closures in the chain", function* () {
			flow = new RuleFlow("flow-name", [appendSuffix, appendSuffix, appendZoo]);
			flow = flow.bind(null, { suffix: "foo" });

			const result = yield flow.process("bar", context());
			result.fact.should.be.equal("bar" + "foo" + "foo" + "zoo");
		});
	});

	it("should fail when built without closure chain", () => {
		(() => new RuleFlow("flow-name")).should.throw();
	});

});

function context() {
	const context = new Context();
	sinon.spy(context, "initiateFlow");
	sinon.spy(context, "endFlow");
	return context;
}