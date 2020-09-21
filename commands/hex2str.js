const Discord = require("discord.js");
module.exports = {
	name: "hex2str",
	description: "Convert a hex value to a string.",
	usage: "hex2str <hex>",
	execute(client, Discord, message, args, gld) {
		if (args.length === 0)
			return message.channel.send("Can't convert empty value.");

		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("hex2str")
				.setDescription(
					Buffer.from(
						args.join(""),
						"hex"
					).toString()
				)
				.setColor(0x2255ff)
		);
	},
};
