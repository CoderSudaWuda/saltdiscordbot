const obj = {};
module.exports = obj;
obj.Storage = require("saltjs").Storage;
obj._ = require("lodash");
obj.logger = require("../classes/logger");
obj.bot = require("./bot").bot;
obj.db = require("../classes/database");
obj.assert = require("assert");
obj.util = require("util");
obj.chalk = require("chalk");
obj.rethink = require("rethinkdb");
obj.toml = require("toml");
obj.msgEmbedToRich = require("discordjs-embed-converter");
obj.fs = require("fs");
obj.klaw = require("klaw-sync");
obj.querystring = require("querystring");
obj.Discord = require("discord.js");
obj.xreg = require("xregexp");
// const Sequelize = require("sequelize");
// const rethinkSetup = require("../misc/rethinkSetup");
obj.data = obj.toml.parse(obj.fs.readFileSync("./data.toml", "utf8"));
/* export const sql = new Sequelize("botdata", data.sql.user || null, data.sql.pass || null, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
}); */
const a = 1;
/* export let r: rethink.Db;
rethink.connect({ host: "localhost", port: 28015 }).then((c) => {
  conn = c;
  r = rethink.db("saltbot");
  rethinkSetup(r, c);
}).catch((err) => { throw err; }); */
// const models = require("../sequelize/sequelize");

// declare const decodeT: (...a) => any;
// const commandParse = 1; // unused

// let obj: {[prop: string]: any} = {};
// export * from "./db";

obj.ownerID = "180813971853410305";

obj.colors = obj.chalk;

// obj.commandHandler = require("../commandHandler");

// obj.commandHandle = obj.commandHandler;

/* tslint:disable:object-literal-sort-keys */
// obj = Object.assign(obj, {
obj.Constants = require("../misc/constants");
obj.decodeT = require("../misc/decodeT");

obj.Command = require("../classes/command");
obj.CommandClient = require("../classes/commandClient");
obj.messager = require("../classes/messager");
obj.perms = require("../classes/permissions");
obj.Searcher = require("../classes/searcher");
obj.Time = require("../classes/time");
/* tslint:enable:object-literal-sort-keys */
