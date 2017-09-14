"use strict";

const fs = require("fs"),
	path = require("path");

const commons = [...scanModules("action"), ...scanModules("condition")];

function scanModules(folder) {
	const folderPath = path.join(__dirname, folder);
	return fs.readdirSync(folderPath).map(file => require(path.join(folderPath, file)));
}

module.exports = engine => {
	commons.forEach(registrant => registrant(engine));
}
