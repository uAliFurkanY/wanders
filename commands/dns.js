const dns = require("dns").promises;
const Discord = require("discord.js");

module.exports = {
	name: "dns",
	description: "desc",
	usage: "dns [-r] address",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	async execute(client, message, args, gld) {
		let reverse = args.includes("-r");
		if (reverse) {
			args.splice(
				args.findIndex((x) => x === "-r"),
				1
			);
		}
		if (!args[0]) throw "ERR_USAGE";
		else if (reverse) {
			dns.reverse(args[0]).then((res) => {
				const embed = new Discord.MessageEmbed();
				embed
					.setColor(0x2255ff)
					.setTitle("Reverse query results")
					.setDescription(res.join("\n"));
				message.channel.send(embed);
			});
		} else {
			dns.resolve(args[0]).then((res) => {
				const embed = new Discord.MessageEmbed();
				embed
					.setColor(0x2255ff)
					.setTitle("Query results")
					.setDescription(res.join("\n"));
				message.channel.send(embed);
			});
		}
	},
};
