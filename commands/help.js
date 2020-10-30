const Discord = require("discord.js");
module.exports = {
	name: "help",
	description: "Displays this.",
	usage: "help",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	async execute(client, message, args, gld) {
		const commands = Array.from(client.commands.entries()).map((x) => x[1]);
		const embed = new Discord.MessageEmbed()
			.setTitle("Wanders")
			.setColor(0xf78d05)
			.setDescription(
				`The prefix is '${gld.prefix}'.
					You can also use me with '<@!${client.user.id}> [command]'.
					'Mod' refers to moderator of the bot, not the server.`
			);
		commands.forEach((cmd) => {
			embed.addField(
				cmd.name,
				`${cmd.description}
			**Usage:** \`${cmd.usage}\``
			);
		});
		message.channel.send(embed);
	},
};
