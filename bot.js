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

  var angy = false;
  // Is angy?
  terms.angy.forEach(angyTerm => {
    if (message.content.includes(angyTerm)) angy = true;
  });

  // Is really angy?
  terms.notAngy.forEach(unAngyTerm => {
    if (message.content.includes(unAngyTerm)) angy = false;
  });

  // If definitely angy, make angy person happi.
  if (angy) {
    message.channel.send(terms.responses[Math.floor(Math.random() * terms.responses.length)] + '\nhttps://raw.githubusercontent.com/llamasking/anti-angery-boi/master/videos/no_angy.mp4');
  }
});

client.login(config.token);