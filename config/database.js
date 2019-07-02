import mongoose from 'mongoose'
mongoose.set('useCreateIndex', true);
mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`, {useNewUrlParser: true});

