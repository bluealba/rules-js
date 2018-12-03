"use strict";

const chai = require("chai")
const chaiPromised = require("chai-as-promised");

const moment = require("moment")

const Engine = require("../../lib/Engine")
const Rule = require("../../lib/closure/Rule")
const Context = require("../../lib/Context")
const commmons = require("../../lib/common");

chai.should();
chai.use(chaiPromised);


describe("dateRange", () => {
	let engine;

	beforeEach("create engine", () => {
		engine = new Engine();
		commmons(engine);
		engine.closures.add("saleDate", (fact) => fact.saleDate)
		engine.closures.add("priceInc", (fact) => { fact.price += 1 ; return fact })
	})

	describe("closure creation", () => {
		it("should just create", () => {
			const specificDateRangeClosure =
				engine.closures.get("dateRange").bind(null, {dateFrom: "2018-09-01", dateExtractor: "saleDate"}, engine)

			specificDateRangeClosure.should.not.be.null
		});

	});

	describe("filter actions with dateFrom", () => {
		let rule

		beforeEach("create rule", () => {
			rule = new Rule(
				"incPrice",
				engine.closures.get("dateRange").bind(null, {dateFrom: "2018-09-01", dateExtractor: "saleDate"}, engine),
				engine.closures.get("priceInc")
			)
		})

		it("should process on date after dateFrom", () => {
			const fact = { saleDate: niceDate(2018, 10, 15), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

		it("should process on date on dateFrom", () => {
			const fact = { saleDate: niceDate(2018, 9, 1), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

		it("should not process before date on dateFrom", () => {
			const fact = { saleDate: niceDate(2018, 7, 21), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(10)
		});

	});

	describe("filter actions with dateTo", () => {
		let rule

		beforeEach("create rule", () => {
			rule = new Rule(
				"incPrice",
				engine.closures.get("dateRange").bind(null, {dateTo: "2018-09-01", dateExtractor: "saleDate"}, engine),
				engine.closures.get("priceInc")
			)
		})

		it("should not process on date after dateTo", () => {
			const fact = { saleDate: niceDate(2018, 10, 15), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(10)
		});

		it("should process on date on dateTo", () => {
			const fact = { saleDate: niceDate(2018, 9, 1), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

		it("should process on date before dateTo", () => {
			const fact = { saleDate: niceDate(2018, 7, 21), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

	});

	describe("filter actions with dateFrom and dateTo", () => {
		let rule

		beforeEach("create rule", () => {
			rule = new Rule(
				"incPrice",
				engine.closures.get("dateRange").bind(null, {dateFrom: "2018-09-01", dateTo: "2018-09-30", dateExtractor: "saleDate"}, engine),
				engine.closures.get("priceInc")
			)
		})

		it("should not process on date way after dateTo", () => {
			const fact = { saleDate: niceDate(2018, 12, 15), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(10)
		});

		it("should not process on date just after dateTo", () => {
			const fact = { saleDate: niceDate(2018, 10, 1), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(10)
		});

		it("should process on date on dateTo", () => {
			const fact = { saleDate: niceDate(2018, 9, 30), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

		it("should process on date between dateFrom and dateTo", () => {
			const fact = { saleDate: niceDate(2018, 9, 12), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

		it("should process on date dateFrom", () => {
			const fact = { saleDate: niceDate(2018, 9, 1), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(11)
		});

		it("should not process on date just before dateFrom", () => {
			const fact = { saleDate: niceDate(2018, 8, 31), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(10)
		});

		it("should not process on date way before dateFrom", () => {
			const fact = { saleDate: niceDate(2018, 7, 21), price: 10 }
			const newFact = rule.process(fact, context())
			newFact.should.not.be.null
			newFact.price.should.equal(10)
		});

	});
});

function context() {
	return new Context();
}

function niceDate(y,m,d) { return moment({year: y, month: (m-1), day: d}).toDate() }
