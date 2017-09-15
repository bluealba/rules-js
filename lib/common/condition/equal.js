"use strict";

module.exports = engine => {
	//Matches only if certain fact field (specified by field) equals to some
	//other specified value
	const fn = (fact, params) => {
		const factValue = params.field ? fact[params.field] : fact;
		return factValue === params.value
	};

	engine.closures.addNamedClosureImpl("equal", fn, {
		requiredParameters: ["value"],
		optionalParameters: ["field"]
	});
}
