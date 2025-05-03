// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const questions = [
  "https://leetcode.com/problems/two-sum/",
  "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  "https://leetcode.com/problems/valid-anagram/",
  // Add more LeetCode 75 problems here
];

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  // Send message every day at 6PM and 7PM
  cron.schedule('0 18,19 * * *', async () => {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      channel.send(`📚 LeetCode Time! Today's problem: ${randomQuestion}`);
    }
  });
});

client.login(process.env.DISCORD_TOKEN);
