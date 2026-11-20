import {
  get_asistencias_por_clase,
  get_asistencias_por_inscripcion,
  get_asistencia_id,
  get_asistencia_por_clase_e_inscripcion,
  post_asistencia,
  put_asistencia,
  filtro_asistencia_por_estado,
} from "../models/asistencias.models.js";

import { get_clase_id } from "../models/clases.models.js";
import { get_inscripcion_id } from "../models/inscripciones.models.js";

import asistencia_schemas, {
  asistencia_put_schemas,
} from "../schemas/asistencias.schemas.js";

import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_asistencia_por_estado = async (req, res, next) => {
  try {
    const { clase_id, asistio } = req.query;
    if (!clase_id || !asistio) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_asistencia_por_estado(clase_id, asistio);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_asistencias_por_clase = async (req, res, next) => {
  try {
    const clase_id = req.params.clase_id || req.query.clase_id;
    if (!clase_id) {
      throwError(errors.campos_faltantes);
    }

    const clase = await get_clase_id(clase_id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const rows = await get_asistencias_por_clase(clase_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_asistencias_por_inscripcion = async (req, res, next) => {
  try {
    const inscripcion_id = req.params.inscripcion_id || req.query.inscripcion_id;
    if (!inscripcion_id) {
      throwError(errors.campos_faltantes);
    }

    const inscripcion = await get_inscripcion_id(inscripcion_id);
    if (!inscripcion) {
      throwError(errors.inscripcion_no_encontrada);
    }

    const rows = await get_asistencias_por_inscripcion(inscripcion_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_asistencia_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const row = await get_asistencia_id(id);
    if (!row) {
      throwError(errors.asistencia_no_encontrada);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

export const c_get_asistencia_por_clase_e_inscripcion = async (req, res, next) => {
  try {
    const clase_id = req.params.clase_id || req.query.clase_id;
    const inscripcion_id = req.params.inscripcion_id || req.query.inscripcion_id;

    if (!clase_id || !inscripcion_id) {
      throwError(errors.campos_faltantes);
    }

    const row = await get_asistencia_por_clase_e_inscripcion(clase_id, inscripcion_id);
    if (!row) {
      throwError(errors.asistencia_no_encontrada);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_asistencia = async (req, res, next) => {
  try {
    const data = req.body;

    const parseA = asistencia_schemas.safeParse(data);
    if (!parseA.success) {
      return res.status(400).json({
        error: parseA.error.issues[0]?.message || "Datos inválidos",
        errors: parseA.error.issues,
      });
    }

    //-------------------------------------------------------------
    const clase = await get_clase_id(data.clase_id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const inscripcion = await get_inscripcion_id(data.inscripcion_id);
    if (!inscripcion) {
      throwError(errors.inscripcion_no_encontrada);
    }

    const asistencia_existe = await get_asistencia_por_clase_e_inscripcion(
      data.clase_id,
      data.inscripcion_id
    );
    if (asistencia_existe) {
      throwError(errors.asistencia_duplicada);
    }
    //--------------------------------------------------------------

    const datos_para_guardar = {
      ...parseA.data,
      registrado_por: req.usuarios.id,
    };

    const row = await post_asistencia(datos_para_guardar);
    return send_success(res, success_messages.asistencia_registrada, row);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_asistencia = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseA = asistencia_put_schemas.safeParse(data);
    if (!parseA.success) {
      return res.status(400).json({
        error: parseA.error.issues[0]?.message || "Datos inválidos",
        errors: parseA.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    const asistencia_actual = await get_asistencia_id(id);
    if (!asistencia_actual) {
      throwError(errors.asistencia_no_encontrada);
    }

    //--------------------------------------------------------------
    const row = await put_asistencia(id, parseA.data.asistio);
    if (!row) {
      throwError(errors.asistencia_no_encontrada);
    }
    return send_success(res, success_messages.asistencia_corregida, row);
  } catch (error) {
    next(error);
  }
};
