"use strict";
const FunctionalClosure = require("../../lib/closure/FunctionalClosure"),
	ClosureRegistry = require("../../lib/closure/ClosureRegistry"),
	Closure = require("../../lib/closure/Closure"),
	Context = require("../../lib/Context"),
	chai = require("chai"),
	chaiPromised = require("chai-as-promised");

chai.should();
chai.use(chaiPromised);

describe("ClosureRegistry", () => {
	let registry;

	beforeEach(() => {
		registry = new ClosureRegistry();
	})

	describe("add (with Function)", () => {

		it("should fail if an closure with the given name is already defined", () => {
			registry.add("true", () => false);
			(() => registry.add("true", () => true)).should.throw();
		});

		it("should replace a closure if override option is provided", () => {
			registry.add("true", () => false);
			registry.add("true", () => true, { override: true });

			const result = registry.get("true").process("foo", context());
			result.should.be.true;
		});

	});

	describe("add (with Closure)", () => {

		it("should fail if an closure with the given name is already defined", () => {
			registry.add("true", new FunctionalClosure("true", () => false));
			(() => registry.add("true", new FunctionalClosure("true", () => true))).should.throw();
		});

		it("should replace a closure if override option is provided", () => {
			registry.add("true", new FunctionalClosure("true", () => false));
			registry.add("true", new FunctionalClosure("true", () => true), { override: true });

			const result = registry.get("true").process("foo", context());
			result.should.be.true;
		});

	});

	describe("add (with Closure class)", () => {
		const TrueClosure = class extends Closure {
			process(fact, context) {
				return true;
			}
		}
		const FalseClosure = class extends Closure {
			process(fact, context) {
				return false;
			}
		}

		it("should fail if an closure with the given name is already defined", () => {
			registry.add("true", FalseClosure);
			(() => registry.add("true", TrueClosure)).should.throw();
		});

		it("should replace a closure if override option is provided", () => {
			registry.add("true", FalseClosure);
			registry.add("true", TrueClosure, { override: true });

			const result = registry.get("true").process("foo", context());
			result.should.be.true;
		});

	});

	describe("parse", () => {
		beforeEach(() => {
			registry.add("isFoo", fact => fact === "foo", { override: true });
			registry.add("always", fact => true, { override: true });
			registry.add("appendBar", fact => fact + "bar", { override: true });
			registry.add("appendSuffix", (fact, context) => fact + context.parameters.suffix, { override: true });
		})

		it("should return a closure if definition is a simple string", () => {
			const closure = registry.parse("appendBar");
			const result = closure.process("foo", context());
			result.should.be.equal("foobar");
		});

		it("should return a closure if definition contains the closure clause", () => {
			const closure = registry.parse({ "closure": "appendBar" });
			const result = closure.process("foo", context());
			result.should.be.equal("foobar");
		});

		it("should bind the returned closure if additional parameters are provided", () => {
			const closure = registry.parse({ "closure": "appendSuffix", "suffix": "baz" });
			const result = closure.process("foo", context());
			result.should.be.equal("foobaz");
		});

		it("should parse a rule if definition has when/then semantics", () => {
			const closure = registry.parse({
				"when": "isFoo",
				"then": { "closure": "appendSuffix", "suffix": "baz" }
			});

			const result = closure.process("foo", context());
			result.should.be.equal("foobaz");

			const result2 = closure.process("bar", context());
			result2.should.be.equal("bar");
		});

		it("should parse a rule flow if rules field is present in definition", () => {
			const closure = registry.parse(
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

			const result = closure.process("foo", context());
			result.should.be.equal("foobarbaz");

			const result2 = closure.process("zoo", context());
			result2.should.be.equal("zoobaz");
		});

		it("should create a closure reducer if definition is an array", () => {
			const closure = registry.parse(
				[
					{
						"when": "isFoo",
						"then": { "closure": "appendSuffix", "suffix": "bar" }
					},
					{ "closure": "appendSuffix", "suffix": "baz" },
					{ "closure": "appendSuffix", "suffix": "boing" }
				]
			);

			const result = closure.process("foo", context());
			result.should.be.equal("foo" + "bar" + "baz" + "boing");

			const result2 = closure.process("zoo", context());
			result2.should.be.equal("zoo" + "baz" + "boing");
		});

	});


});

function context() {
	return new Context();
}
