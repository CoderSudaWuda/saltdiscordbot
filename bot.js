
console.oldLog = console.log;
console.log = function() {
  const args = Array.from(arguments);
  args.unshift(colors.bgYellow.bold(`[S${bot.shard.id === 0 ? "0" : bot.shard.id || "?"}]`) + " ");
  return console.oldLog.apply({}, args);
};
console.oldError = console.error;
console.error = function() {
  const args = Array.from(arguments);
  args.unshift(colors.bgYellow.bold(`[S${bot.shard.id === 0 ? "0" : bot.shard.id || "?"}]`) + " ");
  return console.oldError.apply({}, args);
};
global.messager = new (require("./misc/messager.js"))();
Object.assign(global, require("./sequelize/sequelize.js"));
const data = toml.parse(fs.readFileSync("./data.toml", "utf8"));
const {Collection} = Discord;
require("./misc/events.js");
process.on("message", data=>{
  processMessage(data);
});
bot.on("message", m => {
  botMessage(m);
});
bot.commands = {};
loadCmds();
messager.on("doEval", data=>{
  messagerDoEval(data);
});
sql.sync().catch(rejct);
bot.login(decodeT(/Beta/.test(process.cwd()) ? data.bot.token_beta : data.bot.token)).catch(rejct);