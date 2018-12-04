"use strict";

module.exports = engine => {
	const fn = (fact, context)  => { return fact[context.parameters.attribute] }

	engine.closures.add("project", fn, { required: ["attribute"] });
}
