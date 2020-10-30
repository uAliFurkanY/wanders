const Discord = require("discord.js");
const util = require("util");
const cp = require("child_process"),
	psTree = util.promisify(require("ps-tree"));
const codeify = require("../codeify");

module.exports = {
	name: "exec",
	description: "Executes a command. (Operator permission required)",
	usage: "exec COMMAND",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	async execute(client, message, args, gld) {
		if (message.author.operator) {
			if (args.length > 0) {
				let msg = await message.channel.send("Executing...");
				const proc = cp.spawn(args.join(" "), { shell: true });
				let ended = false;
				let timeout = false;
				let out = "";
				setTimeout(async () => {
					if (!ended) {
						ended = true;
						timeout = true;
						if (!proc.killed) {
							let children = await psTree(proc.pid);
							children.forEach(async (childPid) => {
								try {
									process.kill(childPid.PID);
								} catch {}
							});
						}
						let embed = new Discord.MessageEmbed()
							.setTitle("PROCESS TIMEOUT")
							.setDescription("Process killed after 15 seconds.")
							.setColor(0xff0000);
						if (msg.editable) msg.edit("", embed);
						else msg = await message.channel.send("", embed);
					}
				}, 15000);
				proc.on("error", async (err) => {
					if (err) {
						ended = true;
						let embed = new Discord.MessageEmbed()
							.setTitle("Error")
							.setDescription("Error while executing process")
							.addField(
								"Error message",
								err.name + ": " + err.message
							)
							.setColor(0xff0000);
						if (msg.editable) msg.edit("", embed);
						else msg = await message.channel.send("", embed);
					}
				});
				const update = async (buf, code, sig) => {
					if (timeout) return;
					out += buf.toString();
					let embed = new Discord.MessageEmbed()
						.setTitle("Process output")
						.setDescription(codeify(out))
						.setColor(0x2ecc71);
					if (ended)
						embed.addField(
							"Process ended",
							"Process exited" +
								(typeof code === "number"
									? "\nExit code: `" + code + "`"
									: "") +
								(sig ? "\nSignal: `" + sig + "`" : "")
						);
					if (msg.editable) msg.edit(embed);
					else msg = await message.channel.send(embed);
				};
				proc.stdout.on("data", update);
				proc.stderr.on("data", update);
				proc.on("exit", async (code, sig) => {
					if (timeout) return;
					ended = true;
					if (msg.editable) msg.edit("Execution done");
					else msg = await message.channel.send("Execution done");
					update("", code, sig);
				});
			} else throw "ERR_USAGE";
		} else {
			message.reply("You are not authorized to use this command.");
		}
	},
};
