"use strict";

const wrap = require("async-class-co").wrap;

class Block {

	static create(engine, definition) {
		const fn = engine.getImplementor(definition.type);
		return new Block(fn, definition);
	}

	constructor(fn, parameters) {
		this.fn = fn;
		this.parameters = parameters;
	}

	/**
	 * Evaluates the block against a fact promise
	 * @param {Promise} factPromise a promise that will be resolved to the fact object
	 * @param {Engine}  engine the contextual fact engine
	 * @return {Promise} a promise that will be resolved to the block result
	 */
	* process(factPromise, engine) {
		const fact = yield factPromise;
		return this.fn.call(this, fact, this.parameters, engine);
	}

}

module.exports = wrap(Block);
