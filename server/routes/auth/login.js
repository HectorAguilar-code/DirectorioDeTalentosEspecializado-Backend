const express = require("express");
const app = express.Router();
const RolModel = require("../../models/permisos/rol.model");
const ApiModel = require("../../models/permisos/api.model");
const UsuarioModel = require("../../models/usuario/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("../../config/config");

app.post("/login", async (req, res) => {
  try {
    const strCorreo = req.body.strCorreo;
    const strContrasena = req.body.strContrasena;
    if (!strCorreo || !strContrasena) {
      return res.status(400).json({
        ok: false,
        msg:
          !strCorreo && !strContrasena
            ? "No se recibio el correo y la contraseña, favor de ingresarlos"
            : !strCorreo
            ? "No se recibio la contraseña, favor de ingresarlo"
            : "No se recibio la contraseña, favor de ingresarlo",
        cont: {
          strCorreo,
          strContrasena,
        },
      });
    }
    const [encontroEmail] = await UsuarioModel.aggregate([
      {
        $match: { blnEstado: true },
      },
      {
        $match: { strCorreo: strCorreo },
      },
      {
        $lookup: {
          from: RolModel.collection.name,
          let: { idObjRol: "$_idObjRol" },
          pipeline: [
            // { $match: { blnEstado: true } }
            { $match: { $expr: { $eq: ["$$idObjRol", "$_id"] } } },
            {
              $project: {
                strNombre: 1,
                strDescripcion: 1,
                blnRolDefault: 1,
                blnEstado: 1,
              },
            },
          ],
          as: "rol",
        },
      },
      {
        $project: {
          blnEstado: 1,
          strNombre: 1,
          strCorreo: 1,
          strApellido: 1,
          strEmail: 1,
          strContrasena: 1,
          strNombreUsuario: 1,
          strImagen: 1,
          strDireccion: "$strDireccion",
          _idObjRol: 1,
          rol: {
            $arrayElemAt: ["$rol", 0],
          },
        },
      },
    ]);

    if (!encontroEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo* ó la contraseña son incorrectas favor de verificarlo",
        cont: {
          strCorreo,
          strContrasena,
        },
      });
    }

    const compararContrasena = bcrypt.compareSync(
      strContrasena,
      encontroEmail.strContrasena
    );
    if (!compararContrasena) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ó la contraseña* son incorrectas favor de verificarlo",
        cont: {
          strCorreo,
          strContrasena,
        },
      });
    }
    const token = jwt.sign({ usuario: encontroEmail }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD_TOKEN,
    });
    return res.status(200).json({
      ok: true,
      msg: "Se logueo el usuario de manera exitosa",
      cont: {
        usuario: encontroEmail,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
      cont: {
        error,
      },
    });
  }
});

module.exports = app;
