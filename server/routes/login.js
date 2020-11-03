const config  = require('config');
const bcrypt = require('bcrypt');

// Express router
const express   = require('express');
const router    = express.Router();

// Model
const {User}   = require('../models/userModels');
// Middleware
const {verifyToken} = require('../middlewares/verify-token');

router.post('/', async (req, res) => { 
    // Verify Email
    const user = await User.findOne({email: req.body.email});
    
    if(!user) return res.status(400).send('Invalid username.');

    // Verify Password
    // Encode entered password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    // var isValidPassword = false;
    // if(req.body.password === user.password) {
    //   isValidPassword = true;
    // }
    if(!validPassword) return res.status(400).send('Incorrect password.');
    //res.json(user);
    try{
      // Send back the authentication
      res.json({
        token:    user.generateAuthToken()
      }); 
    }catch(err) {
      res.status(404).send('error');
    }
})
module.exports = router;