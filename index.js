#!/usr/bin/env node
require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const nkv = require("nkv.db");
const { log, info, error, warn } = require("./logging");
const dbProxy = require("./dbProxy");
const shlex = require("shlex");
const dns = require("dns").promises;
const commandFiles = fs
	.readdirSync("./commands")
	.filter((file) => file.endsWith(".js"));

let id = "";
let prefix = process.env.PREFIX || "..";
let operators = (process.env.OPERATORS || "276363003270791168").split(",");
let guildCache = {};
/** @param {string} id */ const isOp = (id) => operators.includes(id);
let ready = false;
setTimeout(() => (ready ? true : warn("Bot not ready after 5000ms.")), 5000);

const db = new nkv.Database("guilds", "database.sqlite");
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
	client.guilds.cache.forEach((guild) => {
		let gld = { prefix: prefix };
		if (!db.has(guild.id)) {
			db.set(guild.id, gld);
		} else {
			gld = db.get(guild.id);
		}
		guildCache[guild.id] = gld;
	});
});

client.on("message", async (msg) => {
	let user = msg.author;
	let mention = false;

	if (!guildCache[msg.guild.id])
		guildCache[msg.guild.id] = { prefix: prefix };

	if (user.bot) return;
	if (
		!msg.content.startsWith(guildCache[msg.guild.id].prefix) &&
		!msg.content.startsWith("<@!" + id + ">")
	)
		return;
	else if (msg.content.startsWith("<@!" + id + ">")) mention = true;
	if (!msg.guild) return;

	const gld = dbProxy({
		cache: db.get(msg.guild.id) || this.init(),
		init() {
			this.cache = { prefix: prefix };
			guildCache[msg.guild.id] = this.cache;
			db.set(msg.guild.id, this.cache);
			return this.cache;
		},
		set(key, value) {
			this.cache[key] = value;
			guildCache[msg.guild.id] = this.cache;
			db.set(msg.guild.id, this.cache);
		},
		get(key) {
			return this.cache[key];
		},
		has(key) {
			return this.cache.hasOwnProperty(key);
		},
	});
	if (!gld) {
		gld.prefix = prefix;
	}

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
