// PADRÃO
var express = require('express');
var router 	= express.Router();
var Control = require('./control.js');
var control = new Control;
var data = {};
var app = express();
app.use(require('express-is-ajax-request'));

/* GET pagina de login. */
router.get('/', function(req, res, next) {

    if (req.isAjaxRequest())
        res.send('request made through ajax.');
 
    res.send('normal http request');
});


module.exports = router;
