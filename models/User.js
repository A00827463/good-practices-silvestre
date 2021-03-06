// npm install -save validator
const { isEmail } = require('validator');
// npm install -save bcryptjs
const bcrypt = require("bcryptjs");
const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    }
}, {timestamp: true});

UsersSchema.pre("save", function (next) {
    const user = this

    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
            if (saltError) {
                return next(saltError)
            } else {
                bcrypt.hash(user.password, salt, function (hashError, hash) {
                    if (hashError) {
                        return next(hashError)
                    }

                    user.password = hash
                    next()
                })
            }
        })
    } else {
        return next()
    }
});

module.exports = mongoose.model('users', UsersSchema);