const UsuarioModel = require('../models/usuario/usuario.model');//subir nivel
const ObjectId = require('mongoose').Types.ObjectId;

const getRolUsuario = async (id) => {
    try {
      const obtenerUsuarios = await UsuarioModel.aggregate([
        {
          $match:{blnEstado:true, _id: ObjectId(id)}
        },
        {
          $lookup:{
            from: 'rols',
            let: { idObjRol: '$_idObjRol' },
            pipeline: [
                // { $match: { blnEstado: true } }
                { $match: { $expr: { $eq: ['$$idObjRol', '$_id'] } } },
                {
                    $lookup: {
                        from: 'apis',
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
        },
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
      ])
        return obtenerUsuarios;
    } catch (err) {
      return Error(err.message ? err.message : err.name ? err.name : err);
    }
}



module.exports = {
    getRolUsuario,
};