const express = require('express');
const app = express.Router();
const RolModel = require('../../models/permisos/rol.model')
const ApiModel = require('../../models/permisos/api.model');
const UsuarioModel = require('../../models/usuario/usuario.model');
const ObjectId = require('mongoose').Types.ObjectId;
app.get('/', async (req, res) => {
    try {
       const idUsuario = req.query._idUsuario;
       if(!idUsuario || idUsuario.length != 24){
         return res.status(400).json({
           ok:false,
           msg:`${idUsuario ? 'El _idUsuario no es valido': 'No se recibio un identificador de usuario'}`,
           cont:{
             idUsuario
           }
         })
       }
       const [obtenerUsuarios] = await UsuarioModel.aggregate(
        [
            {
                $match: { blnEstado: true }
            },
            {
                $match: { _id: ObjectId(idUsuario) }
            },
            {
                $lookup: {
                    from: RolModel.collection.name,
                    let: { idObjRol: '$_idObjRol' },
                    pipeline: [
                        // { $match: { blnEstado: true } }
                        { $match: { $expr: { $eq: ['$$idObjRol', '$_id'] } } },
                        {
                            $lookup: {
                                from: ApiModel.collection.name,
                                let: { arrApis: '$arrObjIdApis' },
                                pipeline: [
                                    { $match: { $expr: { $in: ['$_id', '$$arrApis'] } } },
                                    {$match: {blnEsMenu:true}},
                                    {$sort:{strNombre:1}}
                                ],
                                as: 'apis'
                            }
                        },
                        {
                            $project: {
                                strNombre: 1,
                                strDescripcion: 1,
                                blnRolDefault: 1,
                                blnEstado: 1,
                                apis: 1
                            }
                        }
                    ],
                    as: 'rol'
                }
            },
            {
                $project: {
                    blnEstado: 1,
                    strNombre: 1,
                    strApellido: 1,
                    strEmail: 1,
                    strNombreUsuario: 1,
                    strDireccion: '$strDireccion',
                    _idObjRol: 1,
                    rol: {
                        $arrayElemAt: ['$rol', 0]
                    },
                }
            }
        ]
    );
      return res.status(200).json({
        ok:true,
        msg:'Se obtuvierón los modulos del usuario exitosamente',
        cont:{
          obtenerUsuarios
        }
      })
    } catch (error) {
        const err = Error(error);
        return res.status(500).json(
            {
                ok: false,
                msg: 'Error en el servidor',
                cont:
                {
                    err: err.message ? err.message : err.name ? err.name : err
                }
            })
    }
})

module.exports = app;