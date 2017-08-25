"use strict";

const ParameterizedBlock = require("./ParameterizedBlock")

/**
 * A condition will be evaluated over a certain fact, returning truthy if the
 * fact applies to such condition.
 *
 * The idea is that the user defines new Condition objects that extend this
 * base parent, providing the logic to assert if a certain fact passes or not
 * such condition.
 *
 * Typically a condition will be defined in the context of a rule, which is
 * basically a condition + an action that will follow.
 *
 * @example <caption>A simple condition</caption>
 *
 * class BuySideCondition extends Condition {
 *  evaluate(fact) {
 *    return fact.model.side === "buy";
 *  }
 * }
 *
 * BuySideCondition.conditionName = "BuySide"
 *
 * Note that we have defined an static property to our BuySideCondition object.
 * That basically tells the engine the name under which we are going to reference
 * the new rule from the json flow definition:
 *
 * {
 *  "condition": { type: "BuySide" },
 *  "action": ...
 * }
 *
 * Such property is optional. If we don't specified the condition will be
 * referenced by class name instead.
 *
 * A good idea to have conditions that can be reused to evaluate
 * several different cases. For such a condition can be parameterized with
 * any number of parameters. This will allow us to refactor the previous example
 * into something like this:
 *
 * @example <caption>A parameterized condition</caption>
 *
 * class SideCondition extends Condition {
 *  evaluate(fact) {
 *    return fact.model.side === this.params.expectedSide;
 *  }
 * }
 *
 * SideCondition.conditionName = "Side";
 * SideCondition.expectedParams = ["expectedSide"];
 *
 * Notice that now we need to declare which parameter our rule is expecting.
 * This will allow us to create a json like this:
 *
 * {
 *  "condition": { "type": "Side", "expectedSide": "buy" },
 *  "action": ...
 * },
 * {
 *  "condition": { "type": "Side", "expectedSide": "sell" },
 *  "action": ...
 * }
 *
 * If you use ES7 decorators you can import Condition.decorator module and do
 * the following
 *
 * @example <caption>Using ES7 decorators</caption>
 *
 * const decorators = require("rules-js/decorators")
 *
 * @decorators.condition({
 * 	conditionName: "Side",
 * 	expectedParams: ["expectedSide"]
 * })
 * class SideCondition extends Condition {
 *   evaluate(fact) {
  *    return fact.model.side === this.params.expectedSide;
  *  }
 * }
 *
 * @type {Condition}
 */
module.exports = class Condition extends ParameterizedBlock {

	/**
	 * Evaluates a ceratain business fact.
	 *
	 * @param  {Fact} fact     a fact object that will wraps around each of the
	 *                         business facts that are evaluated. Typically a
	 *                         condition will evaluate over fact.model.
	 * @param  {Engine} engine the rules engine
	 * @return {boolean}       actually any truthy / falsy value will be fine. this
	 *                         is the result of the rule evaluation.
	 */
	evaluate(fact, engine) { // eslint-disable-line no-unused-vars
		const name = this.constructor.conditionName || this.constructor.name;
		throw new Error(`The condition ${name} is not defining any evaluation logic.
      Did you forget to implement the method evaluate(fact, params) in your
      condition class?`);
	}

}
