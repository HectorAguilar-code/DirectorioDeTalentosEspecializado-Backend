const mongoose = require('mongoose');

let schemaApi = new mongoose.Schema({
    blnEstado: {
        type: Boolean,
        default: true
    },
    strNombre: {
        type: String,
        required: [true, 'No se recibio el strNombre, favor de ingresarlo']
    },
    strIcono: {
        type: String,
        default: 'user'
    },
    strRuta: {
        type: String,
        required: [true, 'No se recibio el strRuta, favor de ingresarlo']
    },
    strMetodo: {
        type: String,
        required: [true, 'No se recibio el strMetodo, favor de ingresarlo']
    },
    strDescripcion: {
        type: String,
        required: [true, 'No se recibio el strDescripcion, favor de ingresarlo']
    },
    blnEsApi: {
        type: Boolean,
        default: true
    },
    blnEsMenu: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('api', schemaApi);