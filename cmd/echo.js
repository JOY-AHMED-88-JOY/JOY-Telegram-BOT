module.exports = {
  name: "echo",
  description: "Echoes back the user message",
  async execute(bot, msg, args) {
    const text = args.join(" ") || "You didn't send anything!";
    await bot.sendMessage(msg.chat.id, text);
  }
};
