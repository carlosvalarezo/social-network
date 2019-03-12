const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;

//Connect to  MongoDB
mongoose.connect(db, { useNewUrlParser: true })
        .then(() => console.log('mongo db connected'))
        .catch(error => console.log(error));

//Passport
app.use(passport.initialize());
require('./config/passport')(passport);
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;
 
app.listen(port, ()=>console.log(`Server on port ${port}`));