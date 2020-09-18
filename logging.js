require("colors");
const moment = require("moment");

function _buildText(text) {
    return `[${moment().format("DD/MM/YYYY hh:mm:ss")}] ${text}`;
}

module.exports = {
	log(text) {
		console.log(_buildText(text));
	},
	info(text) {
		console.error(_buildText("info".bgWhite.black + " " + text));
	},
	error(text) {
		console.error(_buildText("error".bgRed.white + " " + text));
	},
	warn(text) {
		console.warn(_buildText("warn".bgYellow.white + " " + text));
	},
};
