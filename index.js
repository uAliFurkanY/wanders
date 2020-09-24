#!/usr/bin/env node
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const { log, info, error, warn } = require("./logging");
const shlex = require("shlex");
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

let id = "";
let prefix = process.env.PREFIX || "..";
let ready = false;
setTimeout(() => (ready ? true : warn("Bot not ready after 5000ms.")), 5000);

const client = new Discord.Client();
client.commands = new Discord.Collection();
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
client
	.login(process.env.TOKEN)
	.then(() => {
		info("Bot login successful.");
	})
	.catch((e) => {
		error("An error occured.");
		console.error(e);
		process.exit(1);
	});
const gd = require("guild-data")(client, { prefix: prefix });
client.on("ready", () => {
	ready = true;
	info("Bot ready.");
	id = client.user.id;
	client.user.setPresence({
		activity: {
			name: "Ping me for help",
			type: "WATCHING",
		},
	});
});

client.on("message", async (msg) => {
	let user = msg.author;
	let mention = false;
	if (!msg.guild) return;
	if (user.bot) return;
	const gld = gd(msg.guild.id);
	if (
		!msg.content.startsWith(gld.prefix) &&
		!msg.content.startsWith("<@!" + id + ">")
	)
		return;
	else if (msg.content.startsWith("<@!" + id + ">")) mention = true;

	let commandBody;
	mention
		? (commandBody = msg.content.slice(id.length + 4))
		: (commandBody = msg.content.slice(gld.prefix.length));
	const args = shlex.split(commandBody);
	let command = args.shift();

	if (!command && mention) command = "help";
	else if (!command) return;

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(client, msg, args, gld);
	} catch (e) {
		error(e);
		msg.reply("couldn't execute command: `" + e.message + "`!");
	}
});
