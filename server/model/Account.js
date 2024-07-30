const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        unqiue: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    creditBalance: {
        type: Number,
        default: 250000
    },
    investments: {
        gold: {
            type: Number,
            default: 0
        },
        uranium: {
            type: Number,
            default: 0
        },
        ripCoin: {
            type: Number,
            default: 0
        },
        tibCoin: {
            type: Number,
            default: 0
        },
        diamond: {
            type: Number,
            default: 0
        },
        plutonium: {
            type: Number,
            default: 0
        },

    },
    marketHistory: {
        type: Array,
        default: [],
    },
    refreshToken: String
});

module.exports = mongoose.model("Account", accountSchema);