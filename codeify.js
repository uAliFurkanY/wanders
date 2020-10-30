module.exports = function sanitize_codeify_cut(code = "", type = "") {
	return (
		"```" +
		type +
		"\n" +
		code.replace(/`{3}/g, "\\`\\`\\`").substr(0, 2000 - 7 - type.length) +
		"```"
	);
};
