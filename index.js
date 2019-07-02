import {dbService, lolService, ttsService} from './services'

// lolService.getUserPuuidByPseudo('Je suis un Poney').then(res => console.log(res));
// dbService.createItem(User, {discordId: 'oui'});
// dbService.getItemFromDb(User, {discordId: 'oui'}, true).then((er, err) => console.log(er, err));
// dbService.addPuuidToDiscorduser('oui', 'fdffffpddf');
import Discord from 'discord.js';

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if (!msg.guild) return;
    if (msg.content.includes('bonjour') && msg.content.includes('pedrito')) {
        msg.reply('coucou');
    }
    if (msg.content.startsWith('!lol')) {
        // Split the msg to get the pseudo
        const pseudo = msg.content.slice(msg.content.indexOf(' ') + 1);
        if (!pseudo) {
            // The noob forgot to enter his pseudo
            return console.log('no pseudo found');
        }
        msg.react('575036467164872727');
        // Get the author's channel
        const channel = client.channels.get(msg.member.voice.channelID);
        if (!channel)  {
            // The Author isn't in any voice channel
            return msg.reply("T'es dans aucun channel vocal bg");
        }
        // Retrieve the game informations with porofessor
        const game = await lolService.getPorofessorInformations(pseudo);
        // Generate the mp3
        await ttsService.generateGame(game, pseudo);
        // Join the channel and play the mp3
        joinChannelAndPlay(channel, pseudo)
    }
});

function joinChannelAndPlay(channel, pseudo) {
    channel.join().then(async (connection) => {
        const dispatcher = connection.play(__dirname + `/tts/${pseudo}.mp3`, {passes: 3});
        dispatcher.on('finish', () => {
            dispatcher.destroy();
            channel.leave();
        });
    }).catch(e => {
        console.error(e);
    });
}

client.login(process.env.DISCORD_TOKEN);
