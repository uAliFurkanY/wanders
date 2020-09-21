const { error } = require("../logging");
const Discord = require("discord.js");

module.exports = {
	name: "dec2hex",
	description:
		"Converts the given array of decimal bytes to a hexadecimal value.",
	usage: "dec2hex <dec>",
	execute(client, message, args, gld) {
		if (args.length === 0)
			return message.channel.send("Can't convert empty value.");
		try {
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
		} catch (e) {
			error(e.message);
			message.channel.send("Error: " + e.message);
		}
	},
};
