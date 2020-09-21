const Discord = require("discord.js");
module.exports = {
	name: "name",
	description: "desc",
	usage: "name",
	execute(client, message, args, gld) {
		if (args.length === 0)
			return channel.send("Can't convert empty string.");

		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("str2hex")
				.setDescription(
					Buffer.from(
						parsed.arguments[1].toString(),
						"utf8"
					).toString("hex")
				)
				.setColor(0x2255ff)
		);
	},
};
