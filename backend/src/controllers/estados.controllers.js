import {
  get_estados,
  get_estado_id,
  get_estado_por_nombre,
  post_estado,
  put_estado,
  filtro_nombre_estado,
} from "../models/estados.models.js";

import estado_schemas from "../schemas/estados.schemas.js";
import estado_put_schemas from "../schemas/estados_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_estado = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_estado(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_estados = async (req, res, next) => {
  try {
    const rows = await get_estados();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_estado_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_estado_id(id);
    if (!rows) {
      throwError(errors.estado_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_estado = async (req, res, next) => {
  try {
    const data = req.body;

    const parseE = estado_schemas.safeParse(data);
    if (!parseE.success) {
      return res.status(400).json({
        errors: parseE.error.issues,
      });
    }

    //-------------------------------------------------------------
    const estado_existe = await get_estado_por_nombre(data.nombre);
    if (estado_existe) {
      throwError(errors.estado_duplicado);
    }
    //--------------------------------------------------------------

    const rows = await post_estado(parseE.data);
    return send_success(res, success_messages.estado_creado);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_estado = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseE = estado_put_schemas.safeParse(data);
    if (!parseE.success) {
      return res.status(400).json({
        errors: parseE.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    if (data.nombre) {
      const estado_existe = await get_estado_por_nombre(data.nombre, id);
      if (estado_existe) {
        throwError(errors.estado_duplicado);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_estado(id, parseE.data);
    if (!rows) {
      throwError(errors.estado_no_encontrado);
    }
    return send_success(res, success_messages.estado_actualizado);
  } catch (error) {
    next(error);
  }
};

