import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;
const roomSchema = new Schema({
    id: { type: String, unique: true, required: true },
    token: { type: String, required: true},
    players: { type: Object },
    passcode: '',
    game: '',
});

export default Mongoose.model('rooms', roomSchema);