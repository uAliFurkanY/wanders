const Discord = require("discord.js");
module.exports = {
	name: "name",
	description: "desc",
	usage: "name",
	execute(client, Discord, message, args, gld) {
		if (parsed.arguments[1] === undefined)
			return message.channel.send("Can't convert empty value.");

		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("hex2str")
				.setDescription(
					Buffer.from(
						parsed.arguments[1].toString(),
						"hex"
					).toString()
				)
				.setColor(0x2255ff)
		);
	},
};
