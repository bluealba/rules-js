"use strict";

module.exports = engine => {
	const fn = (fact, context)  => { return fact[context.parameters.prop] }

	engine.closures.add("get", fn, { required: ["prop"] });
}
