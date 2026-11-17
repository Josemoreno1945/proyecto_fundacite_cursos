import {
  get_permisos,
  get_permiso_id,
  get_permiso_por_nombre,
  post_permiso,
} from "../models/permisos.models.js";

import permiso_schemas from "../schemas/permisos.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Get---------------------------------------
export const c_get_permisos = async (req, res, next) => {
  try {
    const rows = await get_permisos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_permiso_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_permiso_id(id);
    if (!rows) {
      throwError(errors.permiso_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_permiso = async (req, res, next) => {
  try {
    const data = req.body;

    const parseP = permiso_schemas.safeParse(data);
    if (!parseP.success) {
      return res.status(400).json({
        error: parseP.error.issues[0]?.message || "Datos inválidos",
        errors: parseP.error.issues,
      });
    }

    //-------------------------------------------------------------
    const permiso_existe = await get_permiso_por_nombre(data.nombre);
    if (permiso_existe) {
      throwError(errors.permiso_duplicado);
    }
    //--------------------------------------------------------------

    const row = await post_permiso(parseP.data);
    return send_success(res, success_messages.permiso_creado, row);
  } catch (error) {
    next(error);
  }
};
