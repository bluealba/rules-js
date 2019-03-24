"use strict";

const chai = require("chai")
const chaiPromised = require("chai-as-promised");

const Engine = require("../../lib/Engine")
const Context = require("../../lib/Context")
const commmons = require("../../lib/common");

chai.should();
chai.use(chaiPromised);


describe("dateRange", () => {
	let engine;

	beforeEach(() => {
		engine = new Engine();
		commmons(engine);
	})

	it("fixed value transformer", () => {
		const transformer = engine.closures.get("fixedValue").bind(null, {value: 42}, engine)
		const obtainedValue = transformer.process({a: 4, b: [3,5,28,4]}, context())
		obtainedValue.should.equal(42)
	});

	it("project transformer, gets number", () => {
		const transformer = engine.closures.get("get").bind(null, {prop: "a"}, engine)
		const obtainedValue = transformer.process({a: 4, b: [3,5,28,4]}, context())
		obtainedValue.should.equal(4)
	});

	it("project transformer, gets array", () => {
		const transformer = engine.closures.get("get").bind(null, {prop: "b"}, engine)
		const obtainedValue = transformer.process({a: 4, b: [3,5,28,4]}, context())
		obtainedValue.should.deep.equal([3,5,28,4])
	});
});

function context() {
	return new Context();
}
