const Discord = require("discord.js");
module.exports = {
	name: "hex2str",
	description: "Convert a hex value to a string.",
	usage: "hex2str <hex>",
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
				.setTitle("hex2str")
				.setDescription(Buffer.from(args.join(""), "hex").toString())
				.setColor(0x2255ff)
		);
	},
};
