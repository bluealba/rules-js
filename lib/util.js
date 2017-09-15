"use strict";

module.exports = {
	clone(object) {
		return JSON.parse(JSON.stringify(object));
	}
}
