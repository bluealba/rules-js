"use strict";

module.exports = engine => {
	//Matches only if certain model field (specified by field) equals to some
	//other specified value
	engine.addNamedClosure("equal", (fact, params) => fact.model[params.field] === params.value, {
		requiredParameters: ["field", "value"]
	} );
}
