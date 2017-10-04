"use strict";

const Closure = require("./Closure"),
	wrap = require("async-class-co").wrap,
	util = require("../util");

/**
 * This is a closure that will apply a logical operator to a given pair of closures.
 * The result of this clojure will be
 *
 * of each closure execution will
 * be used as fact for the next closure.
 *
 * @type {LogicalClosure}
 */
class LogicalClosure extends Closure {

	constructor(name, operator, first, second) {
		super(name);
		this.operator = operator || util.raise(`Cannot build logical closure [${name}] without operator`);
		this.first = first || util.raise(`Cannot build logical closure [${name}] without first operand clojure`);
		this.second = second || util.raise(`Cannot build logical closure [${name}] without second operand clojure`);
	}

	* do(fact, context) {
		const firstResult = yield this.first.process(fact, context);
		const secondResult = yield this.second.process(fact, context);

		if (this.operator === "AND") {
			return firstResult && secondResult;
		} else if (this.operator === "OR") {
			return firstResult || secondResult;
		} else {
			util.raise(`Cannot process logical closure [${this.name}]. Operator [${this.operator}] not supported.`);
		}

	}

}

module.exports = wrap(LogicalClosure);
