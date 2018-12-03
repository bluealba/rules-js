
"use strict";

const Closure = require("../../closure/Closure")
const moment = require("moment")


class DateRange extends Closure {
	process(fact, context) {
		const dateInFact = this.getDateInFact(fact, context)
		const dateFrom = this.getDateFromParam("dateFrom", context)
		const dateTo = this.getDateFromParam("dateTo", context)
		if (!dateInFact) { return false }
		return (!dateFrom || dateFrom.isSameOrBefore(dateInFact)) && (!dateTo || dateTo.isSameOrAfter(dateInFact))
	}

	getDateInFact(fact, context) {
		const extractor = context.parameters.dateExtractor
		return moment(extractor.process(fact, context))
	}

	getDateFromParam(paramName, context) {
		const dateAsString = context.parameters[paramName]
		return dateAsString ? moment(dateAsString, "YYYY-MM-DD") : null
	}

}

DateRange.required = [ "dateExtractor" ];
DateRange.closureParameters = [ "dateExtractor" ];


module.exports = engine => {
	engine.closures.add("dateRange", DateRange);
}

