const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const cookieSession = require('cookie-session');
const authRoutes = require('./routes/auth_routes');
const passportSetup = require('./config/passport_setup');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SESSION_KEY]
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_DB_URL);
mongoose.connection.once('open', () => {
    console.log('Connected to database')
})

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000, () => {
    console.log('App running now');
});

module.exports = app;
