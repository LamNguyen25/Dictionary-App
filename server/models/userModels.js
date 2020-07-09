const mongoose  = require('mongoose');
const config    = require('config');
const jwt       = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        minlength: 0,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    word: {
        type: String,
        minlength: 1,
        maxlength: 1024
    },
    type: {
        type: String,
        minlength: 2,
        maxlength: 1024
    },
    definition: {
        type: String,
        minlength: 5,
        maxlength: 1024
    },
});

// We add a method into User object (can be seperate but more convinient like this)
// This generates an JWT encoded 'ID' using { PAYLOAD + PRIVATE_SERVER_KEY }
userSchema.methods.generateAuthToken = function() {
    /*
    this._id : is the ID generated from Schema
    jwt: id
  */
    const token = jwt.sign(
        {
            _id: this._id,
            email: this.email
            
        },
        config.get('jwtPrivateKey'),
        {
            expiresIn: '1h'
        }
    );
    return token;
}

const User  = mongoose.model('User', userSchema);
exports.User = User;

// Joi validate backend (NOT GONNA USE IN THIS PROJECT JUST LEAVE IT HERE!)
exports.validate = function(user) {
    const schema = {
      username: Joi.string()
        .required()
        .min(6)
        .max(255)
        .label("Username"),
      password: Joi.string()
        .required()
        .min(6)
        .max(255)
        .label("Password")
    };
    return Joi.validate(user, schema);  
  }