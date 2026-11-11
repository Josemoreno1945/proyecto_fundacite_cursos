import {
  get_profesiones,
  get_profesion_id,
  get_profesion_por_nombre,
  post_profesion,
  put_profesion,
  filtro_nombre_profesion,
} from "../models/profesiones.models.js";

import profesion_schemas from "../schemas/profesiones.schemas.js";
import profesion_put_schemas from "../schemas/profesiones_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_profesion = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_profesion(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_profesiones = async (req, res, next) => {
  try {
    const rows = await get_profesiones();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_profesion_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_profesion_id(id);
    if (!rows) {
      throwError(errors.profesion_no_encontrada);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_profesion = async (req, res, next) => {
  try {
    const data = req.body;

    const parseP = profesion_schemas.safeParse(data);
    if (!parseP.success) {
      return res.status(400).json({
        errors: parseP.error.issues,
      });
    }

    //-------------------------------------------------------------
    const profesion_existe = await get_profesion_por_nombre(data.nombre);
    if (profesion_existe) {
      throwError(errors.profesion_duplicada);
    }
    //--------------------------------------------------------------

    await post_profesion(parseP.data);
    return send_success(res, success_messages.profesion_creada);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_profesion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseP = profesion_put_schemas.safeParse(data);
    if (!parseP.success) {
      return res.status(400).json({
        errors: parseP.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    if (data.nombre) {
      const profesion_existe = await get_profesion_por_nombre(data.nombre, id);
      if (profesion_existe) {
        throwError(errors.profesion_duplicada);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_profesion(id, parseP.data);
    if (!rows) {
      throwError(errors.profesion_no_encontrada);
    }
    return send_success(res, success_messages.profesion_actualizada);
  } catch (error) {
    next(error);
  }
};

