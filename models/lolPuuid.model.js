import mongoose from 'mongoose'

const LolPuuidSchema = new mongoose.Schema({
    discordUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    puuid: {type: String, required: true},
}, {
    strict: true,
    versionKey: false,
    timestamps: true
});


export const project = {
    discordUser: 1,
    puiid: 1
};


export const lookup = [
    {
        $lookup: {
            from: 'users',
            localField: 'discordUser',
            foreignField: '_id',
            as: 'discordUser'
        }
    },
];


export const model =  mongoose.model('LolPuuid', LolPuuidSchema);
