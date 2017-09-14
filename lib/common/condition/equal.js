"use strict";

module.exports = engine => {
	//Matches only if certain fact field (specified by field) equals to some
	//other specified value
	engine.addNamedClosure("equal", (fact, params) => fact[params.field] === params.value, {
		requiredParameters: ["field", "value"]
	} );
}
