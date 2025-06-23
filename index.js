const TelegramBot = require("node-telegram-bot-api");
const { token, admins } = require("./config");
const fs = require("fs");
const path = require("path");

require("./up");
require("./main");

const bot = new TelegramBot(token, { polling: true });

// load commands
const commands = {};
fs.readdirSync(path.join(__dirname, "cmd")).forEach(file => {
  if (file.endsWith(".js")) {
    const cmd = require(path.join(__dirname, "cmd", file));
    commands[cmd.name] = cmd;
  }
});

// handle messages
bot.on("message", async msg => {
  const chatId = msg.chat.id;
  if (!msg.text) return;
  const parts = msg.text.trim().split(/\s+/);
  const cmdName = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (commands[cmdName]) {
    // admin-only example
    if (commands[cmdName].admin && !admins.includes(msg.from.id)) {
      return bot.sendMessage(chatId, "❌ No permission.");
    }
    commands[cmdName].execute(bot, msg, args);
  } else {
    bot.sendMessage(chatId, "❓ Unknown command. Try /echo.");
  }
});

// graceful shutdown
process.on("SIGINT", () => {
  console.log("Stopping bot...");
  bot.stopPolling();
  process.exit();
});
