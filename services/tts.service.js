import tts from "@google-cloud/text-to-speech";
import util from "util";
import fs from "fs";


const ttsClient = new tts.TextToSpeechClient();


export async function generateText(text, output = 'output') {
    const request = {
        input: {text: text},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: 'fr-FR', ssmlGender: 'NEUTRAL', name: 'fr-FR-Wavenet-B'},
        // Select the type of audio encoding
        audioConfig: {audioEncoding: 'MP3'},
    };
    // Performs the Text-to-Speech request
    const [response] = await ttsClient.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    return await writeFile(`tts/${output}.mp3`, response.audioContent, 'binary');
}

export async function generateGame(game, pseudo) {
    if (game.red.length === 0) {
        return await generateText(`t'es pas en game fils de pute`, pseudo);
    }
    let me = game.blue.filter(p => p.name === pseudo)[0];
    if (me.length === 0) {
        me = game.red.filter(p => p.name === pseudo)[0];
        me.team = 'red';
    } else {
        me.team = 'blue';
    }
    const enemyTeam = (me.team === 'red') ? game['blue'] : game['red'];
    const enemy = enemyTeam.filter(p => p.role === me.role)[0];
    console.log(me, enemy);
    await generateText(`
    Bonjour ${pseudo},
    tu vas te bagarrer contre ${enemy.name} qui joue actuellement tamer pour un total de ${enemy.champion.winrate} winrate pour ${enemy.champion.played} parties.
    Allez, bonnne chance beau gosse.
    `, pseudo);
}
