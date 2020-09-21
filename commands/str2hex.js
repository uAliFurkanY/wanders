const Discord = require("discord.js");
module.exports = {
	name: "str2hex",
	description: "Conver a string to a hex value.",
	usage: "str2hex <str>",
	execute(client, message, args, gld) {
		if (args.length === 0)
			return channel.send("Can't convert empty string.");

		message.channel.send(
			new Discord.MessageEmbed()
				.setTitle("str2hex")
				.setDescription(
					Buffer.from(args.join(" "), "utf8").toString("hex")
				)
				.setColor(0x2255ff)
		);
	},
};
