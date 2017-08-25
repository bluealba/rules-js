"use strict";

const Flow = require("./Flow");

module.exports = class Engine {

	constructor() {
		this.context = {};
	}

	createFlow() {
		return new Flow(this);
	}

}
