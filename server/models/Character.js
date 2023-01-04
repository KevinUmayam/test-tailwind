const { Schema, model } = require("mongoose");
// removed bcrypt because that is for password protection, not used for character

const characterSchema = new Schema({
    charName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    level: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    race: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    alignment: {
        type: String,
        required: true,
        trim: true,
        default: "neutral",
    },
    strength: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    dexterity: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    constitution: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    wisdom: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    intelligence: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    charisma: {
        type: Number,
        required: true,
        trim: true,
        default: 1,
    },
    experience: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdBy: {
        type: String,
        required: true, 
        trim: true,
    }
});


const Character = model("Character", characterSchema);

module.exports = Character;