const express = require('express');
const { verificarAcceso } = require('../../middlewares/permisos');
const app = express.Router();
const RolModel = require('../../models/permisos/rol.model')

app.get('/', async (req, res) => {
    try {
        const blnEstado = req.query.blnEstado == "false" ? false : true;
        let n = { strNombre: '' }
        const obtenerRol = await RolModel.aggregate([
            {
                $match: { blnEstado: blnEstado }
            },
            {
                $lookup: {
                    from: 'apis',
                    let: { arrObjIdApis: '$arrObjIdApis' },
                    pipeline: [
                        // { $match: { blnEstado: true } }
                        { $match: { $expr: { $in: ['$_id', '$$arrObjIdApis'] } } },
                        // {
                        //     $project: {
                        //         strRuta: 1,
                        //         strMetodo: 1
                        //     }
                        // }
                    ],
                    as: 'apis'
                }
            }
        ]);

        return res.status(200).json({
            ok: true,
            msg: 'Se obtuvierón los roles exitosamente',
            cont: {
                obtenerRol
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

app.post('/', async (req, res) => {
    try {
        const body = req.body;
        const bodyRol = new RolModel(body);
        const err = bodyRol.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
                cont: { err }
            })
        }
        if (!body.arrObjIdApis) {
            return res.status(400).json({
                ok: false,
                msg: 'Uno o mas campos no se registrarón favor de ingresarlos',
                cont: { arrObjIdApis: null }
            })
        }
        const encontroRol = await RolModel.findOne({ strNombre: bodyRol.strNombre }, { strNombre: 1 })
        if (encontroRol) {
            return res.status(400).json({
                ok: false,
                msg: 'El rol ya se encuentra registrado',
                cont: { encontroRol }
            })
        }
        const registroRol = await bodyRol.save();
        return res.status(200).json({
            ok: true,
            msg: 'El rol de registro de manera exitosa',
            cont: {
                registroRol
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