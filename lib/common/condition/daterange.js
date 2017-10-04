"use strict";

var moment = require("moment");

module.exports = engine => {
	//Matches if fact field date is between the context start and end dates
	const fn = (fact, context) => {
		let factDate = fact.date ? moment(fact.date) : moment();
		let startDate = moment(context.parameters.start);
		let endDate = moment(context.parameters.end);
		let isDateInRange = moment(factDate).isBetween(startDate, endDate);

		return isDateInRange;
	};

	engine.closures.add("daterange", fn, {
		required: ["start", "end"],
		optionalParameters: []
	});
}
