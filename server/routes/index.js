const express = require('express');
const app = express.Router();


app.use('/auth', require('./auth/login'));
app.use('/auth/permisos', require('./auth/permisos'));
app.use('/usuario', require('./usuario/usuario'));
app.use('/permisos/api', require('./permisos/api'));
app.use('/permisos/rol', require('./permisos/rol'));
app.use('/permisos/modulo', require('./permisos/modulo'));
app.use('/imagen', require('./imagen/imagen'));


module.exports = app;




