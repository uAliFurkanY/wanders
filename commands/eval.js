const Discord = require("discord.js");
const safeEval = require("safe-eval");
const codeify = require("../codeify");
const prettier = require("prettier");

module.exports = {
	name: "eval",
	description: "Evaluates Javascript code. (Operator permission required)",
	usage: "eval CODE",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	async execute(client, message, args, gld) {
		if (message.author.operator) {
			if (args.length > 0) {
				let msg = await message.channel.send("Evaluating...");
				let out;
				try {
					out = safeEval(args.join(" "), {
						client: client,
						message: message,
						args: args,
						gld: gld,
					});
					let embed = new Discord.MessageEmbed()
						.setTitle("Javascript Output")
						.setDescription(
							codeify(
								prettier.format(JSON.stringify(out), {
									parser: "json-stringify",
								}),
								"json"
							)
						)
						.setColor(0xffff00);
					if (await msg.editable) msg.edit("", embed);
					else msg.channel.send(embed);
				} catch (err) {
					let embed = new Discord.MessageEmbed()
						.setTitle("Error")
						.setDescription(codeify(err.toString()))
						.setColor(0xff0000);
					if (await msg.editable) msg.edit("", embed);
					else msg.channel.send(embed);
				}
			} else throw "ERR_USAGE";
		} else {
			message.reply("You are not authorized to use this command.");
		}
	},
};
