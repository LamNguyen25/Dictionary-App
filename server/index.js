const express = require('express');
const app     = express();
const config = require('config');
// Cors
const cors = require('cors');

// Database 
const mongoose = require('mongoose');
const uri      = config.get("mongoURI");

// Check DB connection
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect( uri )
  .then (()    => console.log  ('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.use(cors());
app.use('/test', require('./routes/test'));
app.use('/user', require('./routes/users'));
app.use('/login', require('./routes/login'));
app.use('/action', require('./routes/actions'));

const port = process.env.port || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));