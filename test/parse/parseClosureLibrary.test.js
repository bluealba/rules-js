"use strict";

const chai = require("chai"),
	chaiPromised = require("chai-as-promised");

const Engine = require("../../lib/Engine")
const commmons = require("../../lib/common");


chai.should();
chai.use(chaiPromised);


function addDefinitionsFromFile(name, engine) {
	engine.add(require(`./${name}.flow.json`), { override: true });
}

describe("closure library", () => {
	let engine;

	beforeEach("create engine", () => {
		engine = new Engine();
		commmons(engine);
		addDefinitionsFromFile("closure-library", engine);
	})

	it("has closures", () => {
		engine.closures.get("level42").should.be.ok;
		engine.closures.get("getPrice").should.be.ok;
		(() => engine.closure.get("level43")).should.throw(Error);
	});

	it("process fixed value - numeric", () => {
		const result = engine.process("level42", { productType: "Option", price: 20, quantity: 5 });
		return result.should.eventually.have.property("fact", 42);
	});

	it("process fixed value - string", () => {
		const result = engine.process("dawnOfANewEra", { productType: "Option", price: 20, quantity: 5 });
		return result.should.eventually.have.property("fact", "2018-12-04");
	});

	it("process getter", () => {
		const result = engine.process("getPrice", { productType: "Option", price: 20, quantity: 5 });
		return result.should.eventually.have.property("fact", 20);
	});
});
