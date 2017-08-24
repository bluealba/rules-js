"use strict";

module.exports = (options) => {
	return (target) => {
		target.conditionName = options.conditionName;
		target.expectedParams = options.expectedParams;
	}
}
