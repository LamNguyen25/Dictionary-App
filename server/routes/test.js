// EXPRESS ROUTER
const express   = require('express');
const router    = express.Router();
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    console.log("Hello");
    var user = {
        email: 'user1@gmail',
        password: '123456'
    }
    var thingSchema = new Schema({user}, { strict: false });
    var Thing = mongoose.model('Thing', thingSchema);
    var thing = new Thing({ iAmNotInTheSchema: true });
    thing.save() // iAmNotInTheSchema is now saved to the db!!
    res.json({
        "name": "user",
        "key": "1234"
    })
    
    
    
})


module.exports = router;