const config  = require('config');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const mongoose = require('mongoose');
var url = config.get('mongoURI');

// EXPRESS ROUTER
const express = require('express');
const router  = express.Router();
// Model
const {User}   = require('../models/userModels');

// Middleware
const {verifyToken} = require('../middlewares/verify-token');
const {validateSignupData} = require('../util/validators');

//Get Current User Data
router.get('/me', verifyToken, (req, res) => {
    jwt.verify(req.token, config.get('wtPrivateKey'), async (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({authData});
        }
    })
})

//Create Test Accounts
router.post('/test-account', async(req, res) => {
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    };
    
    const { valid, errors } = validateSignupData(newUser);
    console.log(valid);
    console.log(errors);
    if (!valid) return res.status(400).json(errors);
    
    // Check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    // Add User to the database
    user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
     })
    // Encode password
    // Using bcrypt to encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    
    await user.save();
    res.send('User created successfully');
    
})

// Add new word
router.post('/addNewWord', async(req, res) => {
    let newWord = {
        userId: req.body.userId,
        word: req.body.word,
        type: req.body.type,
        definition: req.body.definition,
        isBookmarked: false,
    };
    //console.log("I'm here in the server");
    
    mongoose.connect(url, function(err, db) {
        if(err) throw err;

        // Check for duplication
        // let new_word = db.collection('words').findOne({ 'word': req.body.word });
        //if (new_word) return res.status(400).send('Word already existed.');
        
        db.collection('words').insertOne(newWord, function(err, res) {
            if(err) throw err;
            
            console.log("New word was added successfully");
            
        });
        
    });
    res.send("word added successfully");
    
})

router.get('/getWordList', async(req, res)=> {
    let wordList = [];
    mongoose.connect(url, function(err, db) {
        if(err) throw err;
        // Sort the result alphabetically by word:
        var mySort = {word: 1};
        db.collection('words').find().sort(mySort).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            
        })
    })
    
})

// Get bookmarked word list
router.get('/getBookmarkedList', async(req, res)=> {
    let wordList = [];
    mongoose.connect(url, function(err, db) {
        if(err) throw err;
        // Sort the result alphabetically by word:
        var mySort = {word: 1};
        db.collection('bookmark').find().sort(mySort).toArray(function(err, result) {
            if (err) throw err;
            res.json(result);
            
        })
    })
    
})

router.post('/bookmark', async(req, res) => {
    mongoose.connect(url, function(err, db) {
        if(err) throw err;
        var query = {'word': req.body.word};
        
        // Find and Update the data
        db.collection('words').findAndModify(
            query, // query
            {word: 1}, // sort
            {$set: {isBookmarked: true}}, //update
            function(err, result) {
            if(err) throw err;
            result.value.isBookmarked = true;
            //console.log(result);
            // Add bookmarked word to new field
            // result variable contains many different element => we just need to get the value
            db.collection('bookmark').insertOne(result.value, function(err, res) { 
                if(err) throw err;
                console.log("Bookmarked word was added successfully");           
            });
        })
})
    res.send("word added successfully");
});

// delete a word
router.post('/delete', async(req, res) => {
    mongoose.connect(url, function(err, db) {
        if (err) throw err;

        var query = {word: req.body.word};

        db.collection('words').deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 word deleted");
            //db.close();
        });
        db.collection('bookmark').deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 word deleted");
            //db.close();
        });

        
    });
     res.send("word deleted successfully");
})

router.post('/unbookmarked', async(req, res) => {
    mongoose.connect(url, function(err, db) {
        if (err) throw err;

        var query = {word: req.body.word};
        
        db.collection('bookmark').deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 word deleted");
            //db.close();
        });

        
    });
     res.send("word deleted successfully");
})

module.exports = router;