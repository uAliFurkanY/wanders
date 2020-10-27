const { error } = require("../logging");

module.exports = {
	name: "hex2dec",
	description:
		"Converts the given hexadecimal value to an array of decimal bytes.",
	usage: "hex2dec <hex>",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	execute(client, Discord, message, args, gld) {
		if (args.length === 0) throw "ERR_USAGE";
		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("hex2dec")
				.setDescription(
					args
						.join(" ")
						.match(/.{1,2}/g)
						.map((x) => parseInt(x, 16))
						.join(" ")
				)
				.setColor(0x2255ff)
		);
	},
};
