"use strict";

module.exports = engine => {
	//Matches only if certain fact field (specified by field) equals to some
	//other specified value
	engine.closures.addNamedClosureImpl("equal", (fact, params) => fact[params.field] === params.value, {
		requiredParameters: ["field", "value"]
	} );
}
