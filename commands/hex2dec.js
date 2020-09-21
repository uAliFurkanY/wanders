const { error } = require("../logging");

module.exports = {
	name: "hex2dec",
	description:
		"Converts the given hexadecimal value to an array of decimal bytes.",
	usage: "hex2dec <hex>",
	execute(client, Discord, message, args, gld) {
		if (args.length === 0)
			return message.channel.send("Can't convert empty value.");
		try {
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
		} catch (e) {
			error(e.message);
			message.channel.send("Error: " + e.message);
		}
	},
};
