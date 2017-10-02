"use strict";
const FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	ClosureRegistry = require("../../lib/closure/ClosureRegistry"),
	Context = require("../../lib/Context"),
	chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

describe("ClosureRegistry", () => {
	let registry;

	beforeEach("create registry", () => {
		registry = new ClosureRegistry();
	})

	describe("add (with Function)", () => {

		it("should fail if an closure with the given name is already defined", () => {
			registry.add("true", () => false);
			(() => registry.add("true", () => true)).should.throw();
		});

		it("should replace a closure if override option is provided", function* () {
			registry.add("true", () => false);
			registry.add("true", () => true, { override: true });

			const result = yield registry.get("true").process("foo", context());
			result.fact.should.be.true;
		});

	});

	describe("add (with Closure)", () => {

		it("should fail if an closure with the given name is already defined", () => {
			registry.add("true", new FunctionalClosure("true", () => false));
			(() => registry.add("true", new FunctionalClosure("true", () => true))).should.throw();
		});

		it("should replace a closure if override option is provided", function* () {
			registry.add("true", new FunctionalClosure("true", () => false));
			registry.add("true", new FunctionalClosure("true", () => false), { override: true });

			const result = yield registry.get("true").process("foo", context());
			result.fact.should.be.true;
		});


	});

	describe("parse", () => {
		beforeEach("register functions", () => {
			registry.add("isFoo", fact => fact === "foo", { override: true });
			registry.add("always", fact => true, { override: true });
			registry.add("appendBar", fact => fact + "bar", { override: true });
			registry.add("appendSuffix", (fact, context) => fact + context.parameters.suffix, { override: true });
		})

		it("should return a closure if definition is a simple string", function* () {
			const closure = registry.create("appendBar");
			const result = yield closure.process("foo", this.context());
			result.fact.should.be.equal("foobar");
		});

		it("should return a closure if definition contains the closure clause", function* () {
			const closure = registry.create({ "closure": "appendBar" });
			const result = yield closure.process("foo", this.context());
			result.fact.should.be.equal("foobar");
		});

		it("should bind the returned closure if additional parameters are provided", function* () {
			const closure = registry.create({ "closure": "appendSuffix", "suffix": "baz" });
			const result = yield closure.process("foo", this.context());
			result.fact.should.be.equal("foobaz");
		});

		it("should create a rule if definition has when/then semantics", function* () {
			const closure = registry.create({
				"when": "isFoo",
				"then": { "closure": "appendSuffix", "suffix": "baz" }
			});

			const result = yield closure.process("foo", this.context());
			result.fact.should.be.equal("foobaz");

			const result2 = yield closure.process("bar", this.context());
			result2.fact.should.be.equal("bar");
		});

		it("should create a rule flow if rules field is present in definition", function* () {
			const closure = registry.create(
				{
					"rules": [
						{
							"when": "isFoo",
							"then": { "closure": "appendSuffix", "suffix": "bar" }
						},
						{
							"when": "always",
							"then": { "closure": "appendSuffix", "suffix": "baz" }
						}
					]
				}
			);

			const result = yield closure.process("foo", this.context());
			result.fact.should.be.equal("foobarbaz");

			const result2 = yield closure.process("zoo", this.context());
			result2.fact.should.be.equal("zoobaz");
		});

		it("should create a closure reducer if definition is an array", function* () {
			const closure = registry.create(
				[
					{
						"when": "isFoo",
						"then": { "closure": "appendSuffix", "suffix": "bar" }
					},
					{ "closure": "appendSuffix", "suffix": "baz" },
					{ "closure": "appendSuffix", "suffix": "boing" }
				]
			);

			const result = yield closure.process("foo", this.context());
			result.fact.should.be.equal("foo" + "bar" + "baz" + "boing");

			const result2 = yield closure.process("zoo", this.context());
			result2.fact.should.be.equal("zoo" + "baz" + "boing");
		});

	});


});

function context() {
	return new Context();
}
