import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    discordId: {type: String, required: true, unique: true},
    lolPuuid: {
        type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'LolPuuid'}],
        default: []
    }
}, {
    strict: true,
    versionKey: false,
    timestamps: true
});

export const project = {
    discordId: 1,
    lolPuuid: 1,
};


export const lookup = [
    {
        $lookup: {
            from: 'lolPuuid',
            let: { lolPuuid: '$lolPuuid' },
            pipeline: [{ $match: { $expr: { $in: ['$_id', '$$lolPuuid'] } } }],
            as: 'lolPuuid'
        }
    }

];


export const model = mongoose.model('User', UserSchema);
