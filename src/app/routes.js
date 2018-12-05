const sql = require("msnodesqlv8");
const database = require('../config/database');

module.exports = (app, passport) => {

    app.get('/', (req,res) => {
        res.redirect('/login');
    });
    
    app.get('/login', (req,res) => {
        if(req.isAuthenticated()) { //método de passport
            res.redirect('/califs');
        } else {
            res.render('login', {
                message: req.flash('loginMessage')
            });
        }
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/califs',
        failureRedirect: '/login',
        failureFlash: true //que se muestren los mensajes
    }));

	app.get('/logout', (req, res) => {
        if(req.isAuthenticated()) { //método de passport
            req.logout();
        }
        res.redirect('/login');
	}); 
    
	app.get('/califs', isLoggedIn, (req, res) => {
        // Mostrar calificaciones
        const query = `SELECT a.nombre AS nombre_alumno, mt.nombre AS Materia, m.nombre AS Maestro, calificacion_1 AS "Calificacion1", calificacion_2 AS "Calificacion2", calificacion_3 AS "Calificacion3", ROUND((calificacion_1 + calificacion_2 + calificacion_3)/3, 2, 0) AS Promedio FROM calificacion c, alumno a, maestro m, materia mt WHERE a.alumno_id = c.alumno_id AND m.maestro_id = c.maestro_id AND mt.materia_id = c.materia_id AND a.alumno_id = ${req.session.passport.user.alumno_id}`;
        sql.query(database.msurl, query, (err, rows) => {
            if(err) {
                return console.log(err);
            }
            res.render('califs', {
                username: `${req.session.passport.user.nombre}`,
                rows: rows
            });
        });
    });
};

const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) { //metodo de passport
        return next();
    } else {
        res.redirect('/login');
    }
};
