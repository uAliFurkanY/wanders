let operators = (process.env.OPERATORS || "276363003270791168").split(",");
module.exports = {
	name: "prefix",
	description:
		"Get/change the prefix of this server. (Mod or Manage Channel permissions to change.)",
	usage: "prefix [new]",
	execute(client, message, args, gld) {
		if (
			typeof args[0] === "string" &&
			(message.guild
				.member(message.author)
				.hasPermission("MANAGE_CHANNELS") ||
				operators.includes(message.author.id))
		) {
			gld.prefix = args[0];
			message.channel.send("Changed the prefix to '" + gld.prefix + "'.");
		} else message.channel.send("The prefix is '" + gld.prefix + "'.");
	},
};
