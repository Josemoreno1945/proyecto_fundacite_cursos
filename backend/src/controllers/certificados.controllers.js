import crypto from "crypto";
import {
  get_certificados,
  get_certificado_id,
  get_certificado_por_codigo,
  get_certificado_por_inscripcion,
  post_certificado,
  cambiar_estado_certificado,
  filtro_codigo_certificado,
} from "../models/certificados.models.js";

import { get_inscripcion_id } from "../models/inscripciones.models.js";

import certificado_schemas from "../schemas/certificados.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_codigo_certificado = async (req, res, next) => {
  try {
    const { codigo } = req.query;
    if (!codigo) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_codigo_certificado(codigo);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_certificados = async (req, res, next) => {
  try {
    const rows = await get_certificados();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_certificado_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const row = await get_certificado_id(id);
    if (!row) {
      throwError(errors.certificado_no_encontrado);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

export const c_get_certificado_por_codigo = async (req, res, next) => {
  try {
    const codigo = req.params.codigo_verificacion || req.params.codigo;
    if (!codigo) {
      throwError(errors.campos_faltantes);
    }
    const row = await get_certificado_por_codigo(codigo);
    if (!row) {
      throwError(errors.certificado_no_encontrado);
    }
    if (row.estado === "anulado") {
      throwError(errors.certificado_anulado);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

export const c_get_certificado_por_inscripcion = async (req, res, next) => {
  try {
    const inscripcion_id = req.params.inscripcion_id || req.params.id;
    if (!inscripcion_id) {
      throwError(errors.campos_faltantes);
    }

    const inscripcion = await get_inscripcion_id(inscripcion_id);
    if (!inscripcion) {
      throwError(errors.inscripcion_no_encontrada);
    }

    const row = await get_certificado_por_inscripcion(inscripcion_id);
    if (!row) {
      throwError(errors.certificado_no_encontrado);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_certificado = async (req, res, next) => {
  try {
    const data = req.body;

    const parseC = certificado_schemas.safeParse(data);
    if (!parseC.success) {
      return res.status(400).json({
        error: parseC.error.issues[0]?.message || "Datos inválidos",
        errors: parseC.error.issues,
      });
    }

    //-------------------------------------------------------------
    const inscripcion = await get_inscripcion_id(data.inscripcion_id);
    if (!inscripcion) {
      throwError(errors.inscripcion_no_encontrada);
    }

    const certificado_existe = await get_certificado_por_inscripcion(data.inscripcion_id);
    if (certificado_existe) {
      throwError(errors.certificado_duplicado);
    }

    const codigo_final =
      parseC.data.codigo_verificacion ||
      `CERT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const codigo_existe = await get_certificado_por_codigo(codigo_final);
    if (codigo_existe) {
      throwError(errors.certificado_duplicado);
    }
    //--------------------------------------------------------------

    const datos_para_guardar = {
      ...parseC.data,
      codigo_verificacion: codigo_final,
      emitido_por: req.usuarios.id,
    };

    const row = await post_certificado(datos_para_guardar);
    return send_success(res, success_messages.certificado_emitido, row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Cambiar estado-----------------------------------------
export const c_cambiar_estado_certificado = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;

    if (!estado) {
      throwError(errors.campos_faltantes);
    }

    const estados_validos = ["emitido", "anulado"];
    if (!estados_validos.includes(estado)) {
      throwError(errors.datos_invalidos);
    }

    const certificado_actual = await get_certificado_id(id);
    if (!certificado_actual) {
      throwError(errors.certificado_no_encontrado);
    }

    const row = await cambiar_estado_certificado(id, estado);
    return send_success(res, success_messages.certificado_estado_actualizado, row);
  } catch (error) {
    next(error);
  }
};
