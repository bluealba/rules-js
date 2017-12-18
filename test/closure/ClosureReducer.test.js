"use strict";
const FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	ClosureReducer = require("../../lib/closure/ClosureReducer"),
	Context = require("../../lib/Context"),
	chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

describe("ClosureReducer", () => {
	let reducer;

	const appendFoo = new FunctionalClosure("appendFoo", fact => fact + "foo");
	const appendBaz = new FunctionalClosure("appendFoo", fact => fact + "baz");
	const appendZoo = new FunctionalClosure("appendZoo", fact => fact + "zoo");
	const raiseError = new FunctionalClosure("appendFoo", fact => { throw new Error("expected") });

	beforeEach(() => {
		reducer = new ClosureReducer("reducer-name", [appendFoo, appendBaz, appendZoo]);
	});

	it("should have name", () => {
		reducer.name.should.equal("reducer-name");
	})

	it("should reduce the provided fact across the whole chain of closures", () => {
		const result = reducer.process("bar", context());
		result.should.be.equal("bar" + "foo" + "baz" + "zoo");
	})

	it("should propagate the error if any closure in the chain fails", () => {
		reducer = new ClosureReducer("reducer-name", [appendFoo, raiseError, appendZoo]);
		(() => reducer.process("bar", context())).should.throw
	})

	describe("when bound to parameters", () => {
		const appendSuffix = new FunctionalClosure("appendSuffix", (fact, context) => fact + context.parameters.suffix);

		it("parameters should be propagated to all closures in the chain", () => {
			reducer = new ClosureReducer("reducer-name", [appendSuffix, appendSuffix, appendZoo]);
			reducer = reducer.bind(null, { suffix: "foo" });

			const result = reducer.process("bar", context());
			result.should.be.equal("bar" + "foo" + "foo" + "zoo");
		});
	});

	it("should fail when built without closure chain", () => {
		(() => new ClosureReducer("reducer-name")).should.throw();
	});

});

function context() {
	return new Context();
}
