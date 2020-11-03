//EXPRESS ROUTER
const express   = require('express');
const router    = express.Router();
const mongoose = require('mongoose');

router.post('/addNewWord', async(req, res) => {
    const newWord = {
        word: req.body.word,
        type: req.body.type,
        definition: req.body.definition,
    };

    await newWord.save();
    res.send('New word is saved successfully');

});

module.exports = router;