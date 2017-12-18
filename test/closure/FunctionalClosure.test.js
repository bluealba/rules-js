"use strict";

const FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	chaiPromised = require("chai-as-promised"),
	chai = require("chai"),
	Context = require("../../lib/Context")

chai.should();
chai.use(chaiPromised);

describe("FunctionalClosure", () => {

	let closure;

	it("should have name", () => {
		closure = new FunctionalClosure("some-closure", () => true);
		closure.should.have.property("name").equal("some-closure");
	});

	it("should pass execution context to function", () => {
		const ctx = context();
		ctx.suffix = "bar";

		closure = new FunctionalClosure("some-closure", (fact, ctx) => fact + ctx.suffix);
		const result = closure.process("foo", ctx);
		result.should.equal("foobar")
	});

	describe("with no parameters", () => {
		beforeEach(() => {
			closure = new FunctionalClosure("some-closure", (fact, context) => fact + "bar");
		});

		it("should execute the associated function when invoked", () => {
			const result = closure.process("foo", context());
			result.should.equal("foobar");
		});
	});

	describe("with required parameters", () => {
		beforeEach(() => {
			closure = new FunctionalClosure("some-closure", (fact, context) => fact + context.parameters.suffix, { required: ["suffix"] });
		});

		it.skip("should fail when executed unbounded", () => {
			(() => closure.process("foo", context())).should.eventually.throw();
		});

		it.skip("should fail when binding but parameter not provided", () => {
			(() => closure.bind(null, {})).should.throw();
		});

		it("should use parameter to resolve result", () => {
			closure = closure.bind(null, { suffix: "foo" });
			const result = closure.process("foo", context());
			result.should.equal("foofoo");
		});

	});

	describe("with optional parameters", () => {
		beforeEach(() => {
			closure = new FunctionalClosure("some-closure", (fact, context) => fact + context.parameters.suffix);
		});

		it("should work when executed unbounded", () => {
			const result = closure.process("foo", context());
			result.should.equal("fooundefined");
		});

		it("should work when binding but parameter not provided", () => {
			closure = closure.bind(null, { });
			const result = closure.process("foo", context());
			result.should.equal("fooundefined");
		});

		it("should use parameter to resolve result", () => {
			closure = closure.bind(null, { suffix: "foo" });
			const result = closure.process("foo", context());
			result.should.equal("foofoo");
		});

	});

	it("should fail if not built with a function", () => {
		(() => new FunctionalClosure("name", undefined)).should.throw();
		(() => new FunctionalClosure("name", "this is not a function")).should.throw();
	});

});

function context() {
	return new Context();
}
