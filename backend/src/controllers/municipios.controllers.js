import {
  get_municipios,
  get_municipios_por_estado,
  get_municipio_id,
  get_municipio_por_nombre,
  post_municipio,
  put_municipio,
  filtro_nombre_municipio,
} from "../models/municipios.models.js";

import { get_estado_id } from "../models/estados.models.js";

import municipio_schemas from "../schemas/municipios.schemas.js";
import municipio_put_schemas from "../schemas/municipios_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_municipio = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_municipio(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_municipios = async (req, res, next) => {
  try {
    const rows = await get_municipios();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_municipios_por_estado = async (req, res, next) => {
  try {
    const estado_id = req.params.estado_id;
    const estado = await get_estado_id(estado_id);
    if (!estado) {
      throwError(errors.estado_no_encontrado);
    }
    const rows = await get_municipios_por_estado(estado_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_municipio_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_municipio_id(id);
    if (!rows) {
      throwError(errors.municipio_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_municipio = async (req, res, next) => {
  try {
    const data = req.body;

    const parseM = municipio_schemas.safeParse(data);
    if (!parseM.success) {
      return res.status(400).json({
        errors: parseM.error.issues,
      });
    }

    //-------------------------------------------------------------
    const estado = await get_estado_id(data.estado_id);
    if (!estado) {
      throwError(errors.estado_no_encontrado);
    }

    const municipio_existe = await get_municipio_por_nombre(data.nombre, data.estado_id);
    if (municipio_existe) {
      throwError(errors.municipio_duplicado);
    }
    //--------------------------------------------------------------

    const rows = await post_municipio(parseM.data);
    return send_success(res, success_messages.municipio_creado);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_municipio = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseM = municipio_put_schemas.safeParse(data);
    if (!parseM.success) {
      return res.status(400).json({
        errors: parseM.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    const municipio_actual = await get_municipio_id(id);
    if (!municipio_actual) {
      throwError(errors.municipio_no_encontrado);
    }

    //--------------------------------------------------------------
    if (data.estado_id) {
      const estado = await get_estado_id(data.estado_id);
      if (!estado) {
        throwError(errors.estado_no_encontrado);
      }
    }

    //--------------------------------------------------------------
    if (data.nombre || data.estado_id) {
      const estado_id_a_usar = data.estado_id ?? municipio_actual.estado_id;
      const nombre_a_usar = data.nombre ?? municipio_actual.nombre;
      const municipio_existe = await get_municipio_por_nombre(nombre_a_usar, estado_id_a_usar, id);
      if (municipio_existe) {
        throwError(errors.municipio_duplicado);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_municipio(id, parseM.data);
    if (!rows) {
      throwError(errors.municipio_no_encontrado);
    }
    return send_success(res, success_messages.municipio_actualizado);
  } catch (error) {
    next(error);
  }
};

