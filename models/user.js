const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    temp_password : {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema);

function validateRegisterUser(User){
    const schema = Joi.object({
       username: Joi.string().alphanum().min(6).max(255).required(),
       email: Joi.string().email({ tlds: { allow: false } }).required(),
       password: Joi.string().regex(RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{6,1024}/)).required().min(6).max(1024)
    })

    const result = schema.validate(User);
    return result;
}

function validateLoginUser(User){
    const schema = Joi.object({
       username: Joi.string().alphanum().min(6).max(255).required(),
       password: Joi.string().regex(RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{6,1024}/)).required().min(6).max(1024)
    })

    const result = schema.validate(User);
    return result;
}

exports.User = User;
exports.validateRegisterUser = validateRegisterUser;
exports.validateLoginUser = validateLoginUser;