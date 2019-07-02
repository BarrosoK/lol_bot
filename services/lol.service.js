import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import nightmare from 'nightmare';
import cheerio from 'cheerio';

/*
doc
https://developer.riotgames.com/api-methods/#spectator-v4/GET_getCurrentGameInfoBySummoner
 */

const httpInstance = axios.create({
    baseURL: 'https://euw1.api.riotgames.com/lol/summoner/v4/',
    headers: {
        'X-Riot-Token': process.env['RIOT_API_KEY']
    }
});

export function getUserByPseudo(pseudo) {
    return httpInstance.get(`summoners/by-name/${pseudo}`);
}

export async function getUserPuuidByPseudo(pseudo) {
    const user = await getUserByPseudo(pseudo);
    return user.data['puuid'];
}

export function getPorofessorInformations(pseudo) {

    return new Promise((resolve, reject) => {
        const n = nightmare()
            .goto(`https://porofessor.gg/fr/live/euw/${pseudo}`)
            .wait('.site-content-bg')
            .evaluate(() => document.querySelector('.site-content-bg').innerHTML)
            .end()
            .then((html) => {
                const $ = cheerio.load(html);
                const game = {
                    red: [],
                    blue: []
                };
                $('ul.cards-list li').each((i, el) => {
                    let $div = $(el).find('div.card');
                    let player = {
                        name: $div.attr('data-summonername'),
                        champion: {}
                    };

                    let $role = $(el).find('div.rolesBox');
                    const role = $role.find(".imgFlex .txt .title").text().trim().split(' ')[0];
                    player.role = role;

                    const $champion = $(el).find('div.championBox');
                    const championWinrate = $champion.find(".imgFlex .txt .title").text().trim().split(' ')[0];
                    player.champion.winrate = championWinrate;
                    let played = $champion.find(".imgFlex .txt .title span").text();
                    let num = played.replace(/[^0-9]/g, '');
                    player.champion.played = parseInt(num, 10);

                    if (i < 5) game.blue.push(player);
                    else if (i < 10) game.red.push(player);
                });
                resolve(game);
            })
            .catch(error => {
                reject(error);
            });
    })
}

