"use strict";

module.exports = engine => {
	engine.addImplementor("error", (fact, params) => { throw new Error(params.message) });
}
