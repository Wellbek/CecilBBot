var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

const { Discord, Client, Intents } = require('discord.js');
const { data } = require("jquery");

const prefix = '!'

//Update apiKey from https://developer.riotgames.com/
const apiKey = 'RGAPI-0f2e069a-bfd9-42c3-acaf-9bfe2a577f56';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.once('ready', () => {
    console.log('Cecil B. Bot is online!');
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping'){
        message.channel.send('pong!');
    } else if (command == 'rank'){
        var summonerName = args[0];
        $.getJSON(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`, function(oData) {        

            $.getJSON(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${oData.id}?api_key=${apiKey}`, function(iData) {     
                var arrayEntry = 0;
                if (args[1] == null || args[1] == "solo"){
                    for(let i = 0; i < iData.length; i++){
                        if (iData[i].queueType == "RANKED_SOLO_5x5") arrayEntry = i;
                    }
                }  else if (args[1] == "flex"){
                    for(let i = 0; i < iData.length; i++){
                        if (iData[i].queueType == "RANKED_FLEX_SR") arrayEntry = i;
                    }
                }          
                message.channel.send(iData[arrayEntry].tier + " " + iData[arrayEntry].rank + " " + iData[arrayEntry].leaguePoints + "LP | " + Math.round(iData[arrayEntry].wins / (iData[arrayEntry].wins+iData[arrayEntry].losses) * 100) + " % with " + (iData[arrayEntry].wins + iData[arrayEntry].losses) + " Games played https://euw.op.gg/summoner/userName="+ summonerName.toLowerCase());     
            });
        });
    }
});

client.login('OTA0NzcxMDkzNTIzNDc2NDkw.YYAXvg.v9VRoCAlpBdtwQzqdVJDdOMt7OM');