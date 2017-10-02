"use strict";

module.exports = {
	clone(object) {
		return JSON.parse(JSON.stringify(object));
	},

	raise(message) {
		throw new Error(message);
	}
}
