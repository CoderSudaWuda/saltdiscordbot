import * as assert from "assert";
import * as chalk from "chalk";
import * as Discord from "discord.js";
import * as fs from "fs";
import * as _ from "lodash";
import * as Sequelize from "sequelize";
import * as toml from "toml";
import * as util from "util";

import Command from "../classes/command";
import CommandClient from "../classes/commandClient";
import logger from "../classes/logger";
import perms from "../classes/permissions";
import commandHandler from "../commandHandler";

import * as Constants from "../misc/constants";
import decodeT from "../misc/decodeT";
import messager from "../misc/Messager";
// declare const decodeT: (...a) => any;
const commandParse: any = 1; // unused

export const data = toml.parse(fs.readFileSync("./data.toml", "utf8"));

// let obj: {[prop: string]: any} = {};
export const bot = new CommandClient({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"],
  fetchAllMembers: true,
});

export const sql = new Sequelize("botdata", data.sql.user || null, data.sql.pass || null, {
  host: "localhost",
  dialect: "postgre",
  logging: false,
});

export const ownerID: string = "180813971853410305";

export const colors = chalk;

export const commandHandle = commandHandler;
export const commandParser = commandParse;

/* tslint:disable:object-literal-sort-keys */
// obj = Object.assign(obj, {
export {
  _,
  assert,
  Command,
  commandHandler,
  commandParse,
  Constants,
  Discord,
  fs,
  toml,
  Sequelize,
  util,
  messager,
  perms,
  logger,
  chalk,

  decodeT,
}; // );
/* tslint:enable:object-literal-sort-keys */