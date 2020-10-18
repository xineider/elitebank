var express = require('express');
var session = require('express-session');
var parseurl = require('parseurl');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Control = require('./app/controller/control.js');
const fileUpload = require('express-fileupload');

var login = require('./app/controller/login');
var index = require('./app/controller/index');
var api = require('./app/controller/api');
var recarga = require('./app/controller/recarga');
var minha_conta = require('./app/controller/minha_conta');
var historico = require('./app/controller/historico');
var suporte = require('./app/controller/suporte');
var log_trader = require('./app/controller/log_trader');
var administracao = require('./app/controller/administracao');


var VerificacaoModel = require('./app/model/verificacaoModel');
var verificacao = new VerificacaoModel;

var app = express();
var control = new Control;

var sassMiddleware = require('node-sass-middleware');

app.use(require('express-is-ajax-request'));
// INICIANDO SESSION
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'sistemamoon',
  resave: true,
  saveUninitialized: true
}));


// app.use(function(req,res,next){
//   req.session.usuario = {};
//   req.session.usuario.id = 1;
//   req.session.usuario.nivel = 1;
//   next();
// });


// Verifica usuario se esta logado ou não
// app.use(function (req, res, next) {
//   var pathname = parseurl(req).pathname;
//   if ((pathname != '/' && pathname != '') && 
//       (pathname.indexOf("css") == -1 && pathname.indexOf("js") == -1 && pathname.indexOf("imgs") == -1 && pathname.indexOf("fonts") == -1) && 
//         req.isAjaxRequest() == true){
//     var id = req.headers['authority-optima-id'];
//     var hash = req.headers['authority-optima-hash'];
//     var nivel = req.headers['authority-optima-nivel'];
//     verificacao.VerificarUsuario(id, hash,nivel).then(data => {
//       if (data.length > 0) {
//         req.session.usuario = {};
//         req.session.usuario.id = id;
//         req.session.usuario.hash_login = hash;
//         req.session.usuario.nivel = nivel;
//         req.session.usuario.id_empresa = data[0].id_empresa;
//         next();
//       } else {
//         req.session.destroy(function(err) {
//           res.json('<img src="/assets/imgs/logout.gif"><script>setTimeout(function(){ window.location.replace("/"); }, 4100);</script>');
//         });
//       }
//     });
//   } else if (control.Isset(req.session.usuario, false)
//     && (pathname != '/' && pathname != '')
//       && (pathname.indexOf("css") == -1 && pathname.indexOf("js") == -1 && pathname.indexOf("imgs") == -1 && pathname.indexOf("fonts") == -1)) {
//     res.redirect('/');
//   } else {
//     next();
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /assets
//app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());





app.use(sassMiddleware({
    src: __dirname,
    debug: true,
    outputStyle: 'compressed'
}));




app.use("/public", express.static(__dirname + '/public'));



// app.use(express.static(path.join(__dirname, '/assets')));
// console.log(path.join(__dirname, 'assets'));

app.use('/', login);
app.use('/sistema', index);
app.use('/sistema/api', api);
app.use('/sistema/recarga', recarga);
// app.use('/sistema/minha_conta', minha_conta);
app.use('/sistema/historico', historico);
app.use('/sistema/suporte', suporte);
app.use('/sistema/log_trader', log_trader);
app.use('/sistema/administracao', administracao);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.log('ERROR --------------------- ERROR');
  console.log(err.message);
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
	if (typeof req.session.id_usuario != 'undefined' && req.session.id_usuario != 0) {
  	res.render('error', { erro: 'Página não existente.', tipo_erro: '404' });
  } else {
  	res.render('login/index', { erro: 'Página não existente, faça o login para acessar o sistema.', tipo_erro: '404' });
  }
});
// app.listen(3000);

module.exports = app;
