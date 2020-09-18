#!/usr/bin/env node
require("dotenv").config();
const Discord = require("discord.js");
const nkv = require("nkv.db");
const { log, info, error, warn } = require("./logging");
const minimist = require("minimist");
const shlex = require("shlex");
const fs = require("fs");
const prettier = require("prettier");
const dns = require("dns").promises;

let id = "";
let prefix = process.env.PREFIX || "..";
let invite = process.env.INVITE || "No invite URL set.";
let operators = (process.env.OPERATORS || "276363003270791168").split(",");
/** @param {string} id */ const isOp = (id) => operators.includes(id);
let ready = false;
setTimeout(() => (ready ? true : warn("Bot not ready after 5000ms.")), 5000);

const db = new nkv.Database("guilds", "database.sqlite");
const client = new Discord.Client();
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
	let member = msg.guild.member(user);
	let channel = msg.channel;
	let mention = false;

	let guild = db.get(msg.guild.id);
	const changeValue = (key, value) => {
		guild[key] = value;
		db.set(msg.guild.id, guild);
	};
	if (!guild) {
		guild = {};
		changeValue("prefix", prefix);
	}

	if (user.bot) return;
	if (
		!msg.content.startsWith(guild.prefix) &&
		!msg.content.startsWith("<@!" + id + ">")
	)
		return;
	else if (msg.content.startsWith("<@!" + id + ">")) mention = true;
	if (!msg.guild) return;

	let commandBody;
	mention
		? (commandBody = msg.content.slice(id.length + 4))
		: (commandBody = msg.content.slice(guild.prefix.length));
	const cmdArray = shlex.split(commandBody);
	const parsed = minimist(cmdArray);
	parsed.arguments = parsed._;
	const formatted = prettier.format(JSON.stringify(parsed), {
		parser: "json",
	});
	let command = parsed.arguments[0];

	if (!command && mention) command = "help";
	else if (!command) return;
	switch (command) {
		case "help":
			const embed = new Discord.MessageEmbed()
				.setTitle("Wanders")
				.setColor(0xf78d05)
				.setDescription(
					`The prefix is '${guild.prefix}'.
					You can also use me with '<@!${id}> [command]'.
					'Mod' refers to moderator of the bot, not the server.`
				)
				.addFields([
					{
						name: "help",
						value: `Displays this.
                        **Usage:** help`,
					},
					{
						name: "invite",
						value: `Get an invite link for the bot.
                        **Usage:** eval`,
					},
					{
						name: "prefix",
						value: `Displays the prefix or changes it. (Manage Channels or Mod) 
                        **Usage:** prefix [new]`,
					},
					{
						name: "test",
						value: `Echoes back the command + arguments.
                        **Usage:** test [OPTIONS] VALUE1 VALUE...`,
					},
					{
						name: "dns",
						value: `Resolve DNS queries.
                        **Usage:** dns [-r] address`,
					},
					{
						name: "str2hex",
						value: `Converts the given string to a hexadecimal value.
                        **Usage:** str2hex <string>`,
					},
					{
						name: "hex2str",
						value: `Converts the given hexadecimal value to a string.
                        **Usage:** hex2str <hex>`,
					},
					{
						name: "hex2dec",
						value: `Converts the given hexadecimal value to an array of decimal bytes.
                        **Usage:** hex2dec <hex>`,
					},
				]);
			channel.send(embed);
			break;
		case "invite":
			channel.send(invite);
			break;
		case "prefix":
			if (
				typeof parsed.arguments[1] === "string" &&
				(member.hasPermission("MANAGE_CHANNELS") || isOp(user.id))
			) {
				changeValue("prefix", parsed.arguments[1]);

				channel.send("Changed the prefix to '" + guild.prefix + "'.");
			} else channel.send("The prefix is '" + guild.prefix + "'.");
			break;
		case "test":
			channel.send("```json\n" + formatted + "\n```");
			break;
		case "dns":
			if (
				parsed.arguments[1] === undefined &&
				typeof (parsed.r || parsed.reverse) !== "string"
			)
				return channel.send("No address specified.");
			if (parsed.reverse || parsed.r) {
				await dns
					.reverse(parsed.arguments[1] || parsed.reverse || parsed.r)
					.then((res) => {
						channel.send("```\n" + res.join("\n") + "```");
					});
			} else {
				dns.resolve(parsed.arguments[1])
					.then((res) => {
						channel.send("```\n" + res.join("\n") + "```");
					})
					.catch((e) => {
						channel.send("`Error: " + e.message + "`");
					});
			}
			break;
		case "str2hex":
			if (parsed.arguments[1] === undefined)
				return channel.send("Can't convert empty value.");
			try {
				channel.send(
					new Discord.MessageEmbed()
						.setTitle("str2hex")
						.setDescription(
							Buffer.from(
								parsed.arguments[1].toString(),
								"utf8"
							).toString("hex")
						)
						.setColor(0x2255ff)
				);
			} catch (e) {
				channel.send("Error: " + e.message);
			}
			break;
		case "hex2str":
			if (parsed.arguments[1] === undefined)
				return channel.send("Can't convert empty value.");
			try {
				channel.send(
					new Discord.MessageEmbed()
						.setTitle("hex2str")
						.setDescription(
							Buffer.from(
								parsed.arguments[1].toString(),
								"hex"
							).toString()
						)
						.setColor(0x2255ff)
				);
			} catch (e) {
				channel.send("Error: " + e.message);
			}
			break;
		case "hex2dec":
			if (parsed.arguments[1] === undefined)
				return channel.send("Can't convert empty value.");
			try {
				channel.send(
					new Discord.MessageEmbed()
						.setTitle("hex2dec")
						.setDescription(
							parsed.arguments[1]
								.toString()
								.match(/.{1,2}/g)
								.map((x) => parseInt(x, 16))
								.join(" ")
						)
						.setColor(0x2255ff)
				);
			} catch (e) {
				channel.send("Error: " + e.message);
			}
			break;
		default:
			channel.send("Unknown command: `" + command + "`.");
			break;
	}
});
