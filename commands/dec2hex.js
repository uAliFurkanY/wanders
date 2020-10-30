const { error } = require("../logging");
const Discord = require("discord.js");

module.exports = {
	name: "dec2hex",
	description:
		"Converts the given array of decimal bytes to a hexadecimal value.",
	usage: "dec2hex <dec>",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	async execute(client, message, args, gld) {
		if (args.length === 0) throw "ERR_USAGE";
		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("dec2hex")
				.setDescription(
					args
						.join(" ")
						.split(" ")
						.map((x) => parseInt(x).toString(16))
						.join("")
				)
				.setColor(0x2255ff)
		);
	},
};
