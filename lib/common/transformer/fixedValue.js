"use strict";

module.exports = engine => {
	const fn = (fact, context)  => { return context.parameters.value }

	engine.closures.add("fixedValue", fn, { required: ["value"] });
}
