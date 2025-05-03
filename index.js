// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const questions = require('./questions');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let questionIndex = 0;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel) {
      await channel.send("✅ Bot is online and ready to send LeetCode questions!");
    }
  } catch (err) {
    console.error("Failed to send startup message:", err);
  }
  // Schedule to send a message every day at 7 PM PST (2 AM UTC)
  cron.schedule('0 2 * * *', async () => {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel && questions.length > 0) {
      const question1 = questions[questionIndex % questions.length];
      const question2 = questions[(questionIndex + 1) % questions.length];
      await channel.send(`LeetCode Questions of the Day:\n1. ${question1}\n2. ${question2}`);
      questionIndex += 2;
    }
  });

	cron.schedule('5 0 * * *', async () => {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (channel && questions.length > 0) {
      const question1 = questions[questionIndex % questions.length];
      const question2 = questions[(questionIndex + 1) % questions.length];
      await channel.send(`LeetCode Questions of the Day:\n1. ${question1}\n2. ${question2}`);
      questionIndex += 2;
    }
  });

	client.on('messageCreate', async message => {
		if (message.content === '!daily') {
			const channel = message.channel;
			if (channel && questions.length > 0) {
				const question1 = questions[questionIndex % questions.length];
				const question2 = questions[(questionIndex + 1) % questions.length];
				await channel.send(`📌 LeetCode Daily Questions:\n1. ${question1}\n2. ${question2}`);
				questionIndex += 2;
			}
		}
	});
	cron.schedule('21 23 * * *', async () => {
		await sendDailyQuestions("Scheduled 4:21PM PST TEST");
	});

	async function sendDailyQuestions(prefix = "LeetCode Questions of the Day") {
		const channel = await client.channels.fetch(process.env.CHANNEL_ID);
		if (channel && questions.length > 0) {
			const question1 = questions[questionIndex % questions.length];
			const question2 = questions[(questionIndex + 1) % questions.length];
			await channel.send(`${prefix}:\n1. ${question1}\n2. ${question2}`);
			questionIndex += 2;
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
