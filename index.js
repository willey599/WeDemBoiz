const { Client, Events, GatewayIntentBits, SlashCommandBuilder} = require("discord.js");
require('dotenv').config();
// Get the token from the environment variable
const token = process.env.DISCORD_BOT_TOKEN;
if (!token){
    console.log("Token not found! Or Some error happened.");
    process.exit(1);
}
const express = require ('express');
const app = express();
const PORT = process.env.PORT || 10000;

// Health check endpoint
app.get('/', (req, res) => {
    console.log('Received health check request on /');
    res.send('Discord bot is running!');
});
//listen to satisfy Render
app.listen(PORT, () => {
    console.log("Listening on port 10000");
})

const fs = require('fs').promises;
//path to json file
const dbFilePath = './db.json';
let victimArray = ["snAinsley", "snWillis", "snGudsin", "snJohn"];
let text1 = ["eviscerated", "portended on", "absolutely cooked", "toldest about thyself"];
let text2 = ["scurvy dog", "sea cucumber", "silly goose", "bean", "swine", "[redacted]"];

//new instance of client
const client = new Client({intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`);
    const whoGame = new SlashCommandBuilder()
        .setName('whogame')
        .setDescription('Replies with name of current victim');
        //guildID in the create function
        client.application.commands.create(whoGame, "422229816922865674");
    const lastVictim = new SlashCommandBuilder()
        .setName('lastvictim')
        .setDescription('tells you who was the last victim')
        client.application.commands.create(lastVictim, "422229816922865674");
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === "lastvictim"){
        try{
            const data = await fs.readFile(dbFilePath, 'utf8');
        const fileObject = JSON.parse(data);
        let previousId = fileObject.id - 1;
        if (previousID < 0){
            interaction.reply(`The previous victim was ${victimArray[previousId]}`);
        }
        else {
            interaction.reply("There was no previous victim recorded because this was the first time this bot has been called lol");
        }
    } catch (err){
        console.log("Error occuered whlle awaiting data: " + err);
        }
    console.log(interaction);
    }

    

    if (interaction.commandName === "whogame"){
    try {
        const data = await fs.readFile(dbFilePath, 'utf8');
        const fileObject = JSON.parse(data);
        interaction.reply(`The victim this week is: ${victimArray[fileObject.id]}. Get ${text1[Math.floor(Math.random() * text1.length)]}, you ${text2[Math.floor(Math.random() * text2.length)]}`);
        let arrayIndex = (fileObject.id + 1) % victimArray.length;
        let responseNumber = {
            id : arrayIndex
            };
        await fs.writeFile(dbFilePath, JSON.stringify(responseNumber));
        console.log("successfully wrote to db.json");
    }
    catch (error){
        console.log('No existing data file found, or something else went wrong.');
        try {
            
            await interaction.reply(`The victim this week is: ${victimArray[0]}. Get ${text1[0]}, you ${text2[Math.floor(Math.random() * text2.length)]}`);
            const defaultData = {
                id : 1
            };
            await fs.writeFile(dbFilePath, JSON.stringify(defaultData));
            console.log("Error finding value in file.json. Replacing with default value 0");
        }catch(err){
            console.log("Some other error occured");
            }
        }
    }
    console.log(interaction);
});
//get client from discord.js
client.login(token);