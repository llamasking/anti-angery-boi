// Load and prep Discord and client.
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Load FS and framework module(s)
const fs = require('fs');
const hashthis = require('./framework/hashthis.js');

// Load configs.
require('dotenv').config();
const terms = require('./terms.json');

// Overall hash of everything
const botjshash = hashthis(fs.readFileSync('./bot.js'));

// Get list of files in ./videos/
const videos = fs.readdirSync('./videos', 'utf-8');

// When bot is ready to recieve commands, log details about bot.
client.on('ready', () => {
  console.log(`
    Logged in as ${client.user.tag}.
    Bot.js hash: ${botjshash}
    Time: ${new Date()}\n`);

  client.user.setPresence({
    activities: [{
      name: process.env.ACTIVITY_NAME,
      type: process.env.ACTIVITY_TYPE,
    }]
  });
});

client.on('messageCreate', async (message) => {
  // Filter out bots and group chats/dms.
  if (message.author.bot) return;
  if (message.guild === null) return;

  // Very big and spooky series of transformations.
  // Breaks the message into an array of all lowercase strings of exclusively ascii characters.
  const words = message.content.
    trim().
    toLowerCase().
    replace(/[^a-z ]/g, '').
    replace(/  +/g, ' ').
    split(/ +/g);

  let angy = false;
  // Is angy?
  terms.angy.forEach(angyTerm => {
    if (words.includes(angyTerm)) angy = true;
  });

  // Is really angy?
  terms.notAngy.forEach(unAngyTerm => {
    if (words.includes(unAngyTerm)) angy = false;
  });

  // If definitely angy, make angy person happi.
  if (angy) {
    var randomResponse = terms.responses[Math.floor(Math.random() * terms.responses.length)];
    var randomVideo = `https://llamasking.xyz/anti-angery-boi/videos/${videos[Math.floor(Math.random() * videos.length)]}`;
    message.channel.send(`${randomResponse}\n${randomVideo}`);
  }
});

client.login(process.env.TOKEN);
