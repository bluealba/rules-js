# Rules.JS

[![Build Status](https://travis-ci.org/bluealba/rules-js.svg?branch=master)](https://travis-ci.org/bluealba/rules-js)
[![npm](https://img.shields.io/npm/v/rules-js.svg)](https://npmjs.org/package/rules-js)
[![npm](https://img.shields.io/npm/dt/rules-js.svg)](https://npmjs.org/package/rules-js)
[![Coverage Status](https://coveralls.io/repos/github/bluealba/rules-js/badge.svg?branch=master)](https://coveralls.io/github/bluealba/rules-js?branch=master)

This is an implementation of a very lightweight pure javascript rule engine.
It's very loosely inspired on drools, but keeping an extra effort in keeping
complexity to the bare minimum.

#### Example
This very naive example on how to create an small rule engine to process online
orders. This isn't meant to imitate a full business process, neither to shown
the full potential of Rules.JS.

We start by defining a rules file in JSON.

```json
{
	"name": "process-orders",
	"rules": [
		 {
			 "when": "always",
			 "then": "calculateTotalPrice"
		 },
		 {
			 "when": "hasStockLocally",
			 "then": [
				 { "closure": "calculateTaxes", "salesTax": 0.08 },
				 "makeCreditCardCharge",
				 "createDispatchOrder"
			 ]
		 },
		 {
			 "when": "hasStockAbroad",
			 "then": [
				 "calculateShipping",
				 "makeCreditCardCharge",
				 "createDispatchOrder"
			 ]
		 },
		 {
			 "when": "thereIsNoStock",
			 "then": { "closure": "error", "message": "There is availability of such product"}
		 }
	]
}
```

Now we can evaluate any order using such rules file:

```javascript
const engine = new Engine();
const definitions = require("./process-orders.rules.json");

//... we are missing named closures definition here
const ruleFlow = engine.closures.create(definitions);

const order = {
	books: [
		{ name: "Good Omens", icbn: "0060853980", price: 12.25 }
	],
	client: "mr-goodbuyer"
};

//result is a Promise since rules might evaluate asynchronically.
engine.process(ruleFlow, order)
	.then(dispatchOrder => {
		// any code
	})
	.catch(error => {
		// any error handling
	})
```

Of course, we intentionally omit defining what this verbs mean: *hasStockLocally*,
*calculateTaxes*, *calculateShippingAndHandling*, *makeCreditCardCharge*,
*createDispatchOrder*, *thereIsNoStock*.  Those reference to named **closures** and
are the place were rule implementor should provide their own business code. An
example of such might be something like:

```javascript
engine.closures.addNamedClosureImpl("calculateTotalPrice", (fact, parameters, context)) => {
	fact.totalPrice = fact.books.reduce((totalPrice, book) => totalPrice + book.price, 0);
	return fact;
});

engine.closures.addNamedClosureImpl("calculateTaxes", (fact, parameters, context)) => {
	fact.taxes = fact.totalPrice * parameters.salesTax;
	return fact;
});
```

## Closures
One of the core concepts of Rules.JS are closures. We defined **closure** as any
computation bound to a certain context that can act over a **fact** and return a
value.

We chose to implement closures through plain old javascript functions. This might
be a valid implementation for a closure:

```javascript
function (fact, parameters, context) {
	return fact.totalPrice * parameters.salesTax;
}
```

Note that any closure function will receive three parameters:
```
@param      {Object}  fact        the fact is the object that is current being evaluated by the closure.
@param      {Object}  parameters  a hash of closure bound parameters.
@param      {Object}  context     the fact's execution context
@return     {Object}              the result of the computation (this can be a Promise too!)
```
The main parameter is of course the **fact**, closures need to derive their result
from each different fact that is provided. **parameters** hash is introduced to allow the reuse of closure implementations and **context** is seldom used, we
are going to explore those two later.

Closures will often enhance the current provided fact by adding extra information
to it. A closure can always alter the fact.

```javascript
function (fact, parameters, context) {
	fact.taxes = fact.totalPrice * parameters.salesTax;
	return fact;
}
```

*Note*: It's a good idea to keep closures stateless and idempotent, however this is not a limitation imposed by Rules.JS

### Named closures

In Rules.JS we have a mechanism to tie a closure implementation to a name thus
creating a **name closure**. Named closures an be references by other piece of
the rule engine (*rules*, *ruleFlows*) hence becoming the foundational stones of
the library.

We can register named closures into a rule engine by invoking the following:
```javascript
engine.closures.addNamedClosureImpl("calculateTaxes", (fact, parameters, context)) => {
	fact.taxes = fact.totalPrice * parameters.salesTax;
	return fact;
});
```

Notice that in a simplest form the `addNamedClosureImpl` method receive the name
that we want the closure to have and the closure implementation function.

We can later reference to any named closure in the JSON definition by creating
a json object like the following:

```json
{ "closure": "calculateTaxes" }
```

WIP
