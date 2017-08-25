"use strict";

class Rule {

	constructor(condition, action) {
		this.condition = condition;
		this.action = action;
	}

	/**
	 * Executes the actions associated with this rule over the promised fact
	 * @param  {Promise} factPromise a Promise that should be resovled to a new
	 *                               fact
	 * @param  {Engine} engine       the pricing engine object
	 * @return {Promise}             a Promise that will be resolved to a fact
	 */
	fire(factPromise, engine) {
		let resultPromise;

		if (Array.isArray(this.action)) {
			//if multiple actions are associated then the result has to be reduced
			resultPromise = this.action.reduce((newFactPromise, action) => {
				return newFactPromise.then(newFact => action.do(newFact, engine))
			}, factPromise)
		} else {
			//if only one action is assocated then it's simply executed.
			resultPromise = factPromise.then(fact => this.action.do(fact, engine));
		}

		// add trazability
		return resultPromise.then(fact => {
			const firedRules = fact.firedRules || [];
			firedRules.push(this);
			this.firedRules = firedRules;
			return fact;
		});
	}

}

module.exports = Rule;
