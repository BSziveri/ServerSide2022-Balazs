const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const { newsMiddleware } = require('./lib/middleware');
const app = express()
const port = 3000
const home = require('./routes/home')
const staff = require('./routes/staff')
const cookieParser = require('cookie-parser');

const connectionString = 'mongodb://127.0.0.1:27017/SS2022'




mongoose.connect(connectionString, {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
}).
catch ( error => {
  console.log('Database connection refused' + error);
  process.exit(2);
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log("DB connected")
});


app.use(newsMiddleware)
app.use(cookieParser("una is great"));
app.use(express.static('public'));
app.use('/', home)
app.use('/staff', staff)

// set up handlebars view engine
var handlebars = require('express-handlebars')
.create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.use(express.urlencoded({ extended: true })) 

// custom 404 page
app.use( (req, res) => {
    res.render('404');
});

// custom 500 page
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

