"use strict";

module.exports = {

	raise(message) {
		throw new Error(message);
	},

	nowOrThen(p, block) {
		if (p && p.then) {
			return p.then(block);
		} else {
			return block(p)
		}
	}

}
