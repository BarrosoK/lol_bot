import {User,LolPuuid} from '../models';
import mongoose from "mongoose";

export async function getItemFromDb(schema, query = {}, oneResult = false) {
    const opts = [
        {
            $match: query
        },
        {
            $project: schema.project
        }
    ];
    const pipeline = opts && opts.length > 0 ? schema.lookup.concat(opts) : opts;
    return new Promise((resolve, reject) =>  {
        schema.model.aggregate(pipeline, (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(oneResult ? res.length ? res[0] : null : res);
        });
    });
}

export async function createItem(schema, object = {}) {
    const item = new schema.model(object);
    return item.save();
}

export async function addPuuidToDiscorduser(discordId, puuid) {
    let userDb = await getItemFromDb(User, {discordId}, true);
    if (!userDb) {
        userDb = await createItem(User, {discordId});
    }
    const puuidDb = await createItem(LolPuuid, {discordId, puuid});
    console.log(userDb);
    userDb.lolPuuid.push(puuidDb._id);
    // console.log(puuidDb, userDb.lolPuuid);
    return User.model.updateOne({_id: userDb._id}, {$set: userDb});
}
