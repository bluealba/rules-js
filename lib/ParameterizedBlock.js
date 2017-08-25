"use strict";

module.exports = class ParameterizedBlock {

	constructor(params) {
		this.params = params;
	}

	/**
	 * Creates a new instance of the ParameterizedBlock from the parsed json definition.
	 * The type of the condition must be determined in before-hand (we shouln't
	 * call ParameterizedBlock.instantiate(definition) but ConcreteCondition.instantiate(definition)
	 * instead)
	 */
	static instantiate(definition) {
		const expectedParams = this.expectedParams || [];
		const params = expectedParams.reduce((hash, paramName) => {
			hash[paramName] = definition[paramName];
			return hash;
		}, {});

		return new this(params);
	}

}
