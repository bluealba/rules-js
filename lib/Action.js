"use strict";

const ParameterizedBlock = require("./ParameterizedBlock")

/**
 * An action will be performed over a certain fact and it will return some value.
 * The value returned will be used as fact for the next action invoked (if actions
 * are chained) or returned to the flow client. Such value can be a Promise,
 * since ation execution is evaluated asynchronically.
 *
 * Typically an action will be defined in the context of a rule, which is
 * basically a condition + an action that will follow.
 *
 * @example <caption>An simple async action</caption>
 *
 * class CalculateCommissions extends Action {
 *  perform(fact, engine) {
 *  	return engine.context.someExternalService.calculateCommissions(fact.model.price * fact.model.quantity)
 *  		.then(commissions => {
 *  			fact.model.comissions = comissions;
 *  			return fact;
 *  		});
 *  }
 * }
 *
 * This will be written in json as:
 *  {
 *  	"condition": { "type": "Side", "expectedSide": "buy" },
 *    "action": { type: "CalculateCommissions" }
 *  }
 *
 * If the action is synchronic it can just return the fact object (instead of
 * a Promise)
 *
 * @example
 *
 * class CalculateCost extends Action {
 *  perform(fact) {
 *  	fact.model.cost = (fact.model.price * fact.model.quantity) + fact.model.comissions;
 *  	return fact;
 *  }
 * }
 *
 * Or not return anything at all
 *
 * class CalculateCost extends Action {
 *  perform(fact) {
 *  	fact.model.cost = (fact.model.price * fact.model.quantity) + fact.model.comissions;
 *  }
 * }
 *
 * Actions results can be chained (you can see this as a simple reduce). If you
 * look at the former CalculateCommissions and CalculateCost actions you will
 * notice that there is a dependency on each other.
 *
 * @example chaining actions
 *
 * In json we can chain actions simply by doing something like:
 *  {
 *  	"condition": { "type": "Side", "expectedSide": "buy" },
 *    "action": [
 *    	{ type: "CalculateCommissions" },
 *    	{ type: "CalculateCost" }
 *    ]
 *  }
 *
 * That way for all "buy" facts cost is going to be calculated right after
 * calculating commissions (which might imply an async call).
 *
 * More complex scenarios of action chaining can be achieved by defining
 * multiple rules that are executed over same fact.
 *
 * @type {Action}
 */
module.exports = class Action extends ParameterizedBlock {

	/**
	 * Performs an action over certain business fact.
	 *
	 * @param  {Fact} fact     a fact object that will wraps around each of the
	 *                         business facts that are evaluated.
	 * @param  {Engine} engine the rules engine
	 * @return {Promise}       a Promise that will be resolved to the fact
	 *                         that needs to be used down the chain.
	 */
	do(fact, engine) { // eslint-disable-line no-unused-vars
		const result = this.perform(fact, engine);
		return Promise.resolve(result === undefined ? fact : result);
	}

	/**
	 * Performs an action over certain business fact. This should be implemented
	 * by each concrete action
	 *
	 * @param  {Fact} fact     a fact object that will wraps around each of the
	 *                         business facts that are evaluated.
	 * @param  {Engine} engine the rules engine
	 * @return {Object}        some computation result, or nothing.
	 */
	perform(fact, engine) { // eslint-disable-line no-unused-vars
		const name = this.constructor.actionName || this.constructor.name;
		throw new Error(`The action ${name} is not defining any evaluation logic.
      Did you forget to implement the method evaluate(fact, params) in your
      action class?`);
	}

}
