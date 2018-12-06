
"use strict";

const Closure = require("../../closure/Closure")
const moment = require("moment")


class DateRange extends Closure {
	process(fact, context) {
		const dateInFact = this.getDateInFact(fact, context)
		const dateFrom = this.getDateFromParam("dateFrom", fact, context)
		const dateTo = this.getDateFromParam("dateTo", fact, context)
		const dateBefore = this.getDateFromParam("dateBefore", fact, context)
		const dateAfter = this.getDateFromParam("dateAfter", fact, context)
		if (!dateInFact) { return false }
		return (!dateFrom || dateInFact.isSameOrAfter(dateFrom))
			&& (!dateTo || dateInFact.isSameOrBefore(dateTo))
			&& (!dateBefore || dateInFact.isBefore(dateBefore))
			&& (!dateAfter || dateInFact.isAfter(dateAfter))
	}

	getDateInFact(fact, context) {
		const extractor = context.parameters.dateExtractor
		const extractedValue = extractor.process(fact, context)
		if (extractedValue) {
			const extractedMoment = typeof(extractedValue) === "string" ? moment(extractedValue, "YYYY-MM-DD") : moment(extractedValue)
			return extractedMoment
		} else {
			return null
		}
	}

	getDateFromParam(paramName, fact, context) {
		const dateSource = context.parameters[paramName]
		const dateAsString = dateSource ? dateSource.process(fact, context) : null
		return dateAsString ? moment(dateAsString, "YYYY-MM-DD") : null
	}

}

DateRange.required = [ "dateExtractor" ];
DateRange.closureParameters = [ "dateExtractor", "dateFrom", "dateTo", "dateBefore", "dateAfter" ];


module.exports = engine => {
	engine.closures.add("dateRange", DateRange);
}

