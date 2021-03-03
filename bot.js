// Load and prep Discord and client.
const Discord = require('discord.js');
const client = new Discord.Client();

// Load FS and framework module(s)
const fs = require('fs');
const hashthis = require('./framework/hashthis.js');

// Load configs.
const config = require('./config.json');
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

  client.user.setPresence(config.presence);
});

client.on('guildCreate', (guild) => console.log(`Joined new server: ${guild.name} with ${guild.memberCount - 1} members.`));
client.on('guildDelete', (guild) => console.log(`Left server: ${guild.name} with ${guild.memberCount  - 1} members.`));

client.on('message', message => {
  // Filter out bots and group chats/dms.
  if (message.author.bot) return;
  if (message.guild === null) return;

  const words = message.content.trim().toLowerCase().replace(/[^a-z ]/g, '').split(/ +/g);

  var angy = false;
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

client.login(config.token);
