const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const codeQuestions = require('./codeQuestions');
const systemDesignQuestions = require('./designQuestions');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let codeIndex = 0;
let designIndex = 0;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel) {
      await channel.send("✅ Bot is online and ready to send LeetCode and System Design questions!");
    }
  } catch (err) {
    console.error("Failed to send startup message:", err);
  }

  // ⏰ LeetCode Questions - 7PM PST (2AM UTC)
  cron.schedule('0 2 * * *', async () => {
    await sendCodeQuestions();
  });

  // ⏰ System Design Question - 8PM PST (3AM UTC)
  cron.schedule('0 3 * * *', async () => {
    await sendSystemDesignQuestion();
  });

  async function sendCodeQuestions() {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel && codeQuestions.length > 0) {
      const question1 = codeQuestions[codeIndex % codeQuestions.length];
      const question2 = codeQuestions[(codeIndex + 1) % codeQuestions.length];
      await channel.send(`📌 Daily 7PM - 8PM PST: LeetCode Questions of the Day:\n1. ${question1}\n2. ${question2}`);
      codeIndex += 2;
    }
  }

  async function sendSystemDesignQuestion() {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel && systemDesignQuestions.length > 0) {
      const question = systemDesignQuestions[designIndex % systemDesignQuestions.length];
      await channel.send(`🛠️ Daily 8PM - 9PM PST: System Design Question of the Day:\n${question}`);
      designIndex += 1;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
