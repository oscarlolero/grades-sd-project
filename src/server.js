const express = require('express');

const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const sql = require("msnodesqlv8");

let app = express();
const db = require('./config/database.js');

const query = "SELECT * FROM calificacion";
sql.query(db.msurl, query, (err, rows) => {
    if(err) {
        return console.log(err);
    }
    console.log('Conexión con SQL Server establecida.');
});

require('./config/passport')(passport); //configurar passport

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
// app.use(morgan('dev')); //ver requests de http por consola
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false})); //informacion que reciba de los formularios los voya poder inmtepretar en el url
app.use(session({
    secret: 'secrettttt123',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes.js')(app, passport); //parametros

//static files
app.use(express.static(path.join(__dirname, 'public')));


// Handle 404 - Keep this as a last route
app.use((req, res) => {
    res.redirect('/califs');
});

app.listen(app.get('port'), () => {
    console.log('Server encendido en puerto', app.get('port'));
});