"use strict";

module.exports = engine => {
	engine.addImplementor("always", () => true);
	engine.addImplementor("never", () => false);
	engine.addImplementor("random", () => Math.random() >= 0.5);
}
