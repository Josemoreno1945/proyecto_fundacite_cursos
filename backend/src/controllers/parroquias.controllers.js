import {
  get_parroquias,
  get_parroquias_por_municipio,
  get_parroquia_id,
  get_parroquia_por_nombre,
  post_parroquia,
  put_parroquia,
  filtro_nombre_parroquia,
} from "../models/parroquias.models.js";

import { get_municipio_id } from "../models/municipios.models.js";

import parroquia_schemas from "../schemas/parroquias.schemas.js";
import parroquia_put_schemas from "../schemas/parroquias_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_parroquia = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_parroquia(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_parroquias = async (req, res, next) => {
  try {
    const rows = await get_parroquias();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_parroquias_por_municipio = async (req, res, next) => {
  try {
    const municipio_id = req.params.municipio_id;
    const municipio = await get_municipio_id(municipio_id);
    if (!municipio) {
      throwError(errors.municipio_no_encontrado);
    }
    const rows = await get_parroquias_por_municipio(municipio_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_parroquia_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_parroquia_id(id);
    if (!rows) {
      throwError(errors.parroquia_no_encontrada);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_parroquia = async (req, res, next) => {
  try {
    const data = req.body;

    const parseP = parroquia_schemas.safeParse(data);
    if (!parseP.success) {
      return res.status(400).json({
        errors: parseP.error.issues,
      });
    }

    //-------------------------------------------------------------
    const municipio = await get_municipio_id(data.municipio_id);
    if (!municipio) {
      throwError(errors.municipio_no_encontrado);
    }

    const parroquia_existe = await get_parroquia_por_nombre(data.nombre, data.municipio_id);
    if (parroquia_existe) {
      throwError(errors.parroquia_duplicada);
    }
    //--------------------------------------------------------------

    const rows = await post_parroquia(parseP.data);
    return send_success(res, success_messages.parroquia_creada);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_parroquia = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseP = parroquia_put_schemas.safeParse(data);
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
    const parroquia_actual = await get_parroquia_id(id);
    if (!parroquia_actual) {
      throwError(errors.parroquia_no_encontrada);
    }

    //--------------------------------------------------------------
    if (data.municipio_id) {
      const municipio = await get_municipio_id(data.municipio_id);
      if (!municipio) {
        throwError(errors.municipio_no_encontrado);
      }
    }

    //--------------------------------------------------------------
    if (data.nombre || data.municipio_id) {
      const municipio_id_a_usar = data.municipio_id ?? parroquia_actual.municipio_id;
      const nombre_a_usar = data.nombre ?? parroquia_actual.nombre;
      const parroquia_existe = await get_parroquia_por_nombre(nombre_a_usar, municipio_id_a_usar, id);
      if (parroquia_existe) {
        throwError(errors.parroquia_duplicada);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_parroquia(id, parseP.data);
    if (!rows) {
      throwError(errors.parroquia_no_encontrada);
    }
    return send_success(res, success_messages.parroquia_actualizada);
  } catch (error) {
    next(error);
  }
};

