const Discord = require("discord.js");
const net = require("net");
const codeify = require("../codeify");

module.exports = {
	name: "tcp",
	description: "Creates a TCP connection and bind it to the channel.",
	usage: "tcp [end|<host> <port>]",
	/**
	 * @param {Discord.Client} client
	 * @param {Discord.Message} message
	 * @param {Array} args
	 * @param {Object} gld
	 */
	async execute(client, message, args, gld) {
		/*let sock = global.TCPLIST[message.author.id];
		let hasSocket = sock && sock.readable && sock.writable;
		if (args[0] === "end") {
			try {
				client.off("message", global.LISTENERLIST[message.author.id]);
			} catch {}
			if (hasSocket) {
				sock.end();
			} else {
				message.reply("you don't have an outbound TCP socket.");
			}
		} else if (args.length >= 2) {
			if (hasSocket) {
				return message.reply(
					"you already have an outbound TCP socket."
				);
			}
			args[1] = parseInt(args[1]);
			if (!args[1] || args[1] < 1 || args[1] > 65535) throw "ERR_USAGE";
			if (!args[0] || args[0].startsWith("/"))
				return message.channel.send("Invalid address specified.");
			try {
				global.TCPLIST[message.author.id] = await net.createConnection(
					{
						host: args[0],
						port: args[1],
					},
					() => {
						message.channel.send("Connection established.");
					}
				);
				sock = global.TCPLIST[message.author.id];
				let msgListener = (msg) => {
					if (
						msg.channel.id === message.channel.id &&
						msg.author.id === message.author.id &&
						!msg.content.startsWith(gld.prefix)
					) {
						try {
							if (sock.writable)
								sock.write(msg.content.replace(/\\n/g, "\n"));
						} catch {}
					}
				};
				global.LISTENERLIST[message.author.id] = msgListener;
				let out = "";
				let msg = await message.channel.send("Waiting for data...");
				sock.on("data", (buf) => {
					out += buf.toString();
					if (msg.editable) msg.edit(codeify(out));
					else msg.channel.send(codeify(out));
				});
				sock.on("end", () => {
					try {
						client.off(
							"message",
							global.LISTENERLIST[message.author.id]
						);
					} catch {}
					message.channel.send(
						"<@" + message.author.id + ">'s socket has been ended."
					);
				});
				sock.on("error", (e) => {
					try {
						client.off(
							"message",
							global.LISTENERLIST[message.author.id]
						);
					} catch {}
					message.channel.send(
						"<@" +
							message.author.id +
							">'s socket threw an error: `" +
							e.message +
							"`"
					);
				});
				client.on("message", msgListener);
			} catch (e) {
				message.channel.send("Can not connect: `" + e.message + "`");
			}
		} else throw "ERR_USAGE";*/
		throw "ERR_DISABLED";
	},
};
