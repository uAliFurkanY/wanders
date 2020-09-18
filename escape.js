module.exports = function dcEscape(str) {
	return str.replace(/\n/g, "\\n").replace(/`/g, "\\`");
};
