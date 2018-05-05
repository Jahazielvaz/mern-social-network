const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users.js');
const posts = require('./routes/api/posts.js');
const profile = require('./routes/api/profile.js');

const app = express();
//
// // DB Config
const db = require('./config/keys.js').mongoURI;

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// //Connect to mongodb
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

// // Use routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);
//
//
const port = process.env.PORT || 5000;
//
app.listen(port, () => console.log(`Server running on port ${port}`));
