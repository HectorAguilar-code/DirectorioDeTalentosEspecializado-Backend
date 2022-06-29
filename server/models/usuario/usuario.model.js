const mongoose = require("mongoose");

let schemaOptions = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  collection: "usuario",
};
let SchemaUsuario = mongoose.Schema(
  {
    blnEstado: {
      type: Boolean,
      default: true,
    },
    strNombre: {
      type: String,
      required: [true, "No se recibio el strNombre, favor de ingresarlo"],
    },
    strPrimerApellido: {
      type: String,
      required: [true, "No se recibio el primerApellido, favor de ingresarlo"],
    },
    strSegundoApellido: {
      type: String,
      required: [true, "No se recibio el segundoApellido, favor de ingresarlo"],
    },
    strCorreo: {
      type: String,
      required: [true, "No se recibio el strEmail, favor de ingresarlo"],
    },
    nmbTelefono: {
      type: Number,
      required: [true, "No se recibio el nmbTelefono, favor de ingresarlo"],
    },
    strContrasena: {
      type: String,
      required: [true, "No se recibio el strContrasena, favor de ingresarlo"],
    },
    strDireccion: {
      type: String,
      required: [true, "No se recibio el strDireccion, favor de ingresarlo"],
    },
    strImagen: {
      type: String,
      default: "default.jpg",
    },
    _idObjRol: {
      type: mongoose.Types.ObjectId,
    },
  },
  schemaOptions
);

module.exports = mongoose.model("usuario", SchemaUsuario);
