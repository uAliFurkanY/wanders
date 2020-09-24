module.exports = {
	name: "invite",
	description: "Get the invite link of the bot to add it in your own server.",
	usage: "invite",
	execute(client, message, args, gld) {
		message.channel.send(process.env.INVITE || "No invite URL set.");
	},
};