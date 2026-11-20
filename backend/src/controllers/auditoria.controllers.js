import {
  get_auditoria,
  get_auditoria_id,
  get_auditoria_por_usuario,
  post_auditoria,
  filtro_auditoria_por_modulo,
  filtro_auditoria_por_tabla,
} from "../models/auditoria.models.js";

import { get_usuario_id } from "../models/usuarios.models.js";

import auditoria_schemas from "../schemas/auditoria.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_auditoria_por_modulo = async (req, res, next) => {
  try {
    const { modulo } = req.query;
    if (!modulo) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_auditoria_por_modulo(modulo);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_filtrar_auditoria_por_tabla = async (req, res, next) => {
  try {
    const { tabla } = req.query;
    if (!tabla) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_auditoria_por_tabla(tabla);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_auditoria = async (req, res, next) => {
  try {
    const rows = await get_auditoria();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_auditoria_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const row = await get_auditoria_id(id);
    if (!row) {
      throwError(errors.auditoria_no_encontrada);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

export const c_get_auditoria_por_usuario = async (req, res, next) => {
  try {
    const usuario_id = req.params.usuario_id || req.params.id;
    if (!usuario_id) {
      throwError(errors.campos_faltantes);
    }

    const usuario = await get_usuario_id(usuario_id);
    if (!usuario) {
      throwError(errors.usuario_no_encontrado);
    }

    const rows = await get_auditoria_por_usuario(usuario_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_auditoria = async (req, res, next) => {
  try {
    const data = req.body;

    const parseA = auditoria_schemas.safeParse(data);
    if (!parseA.success) {
      return res.status(400).json({
        error: parseA.error.issues[0]?.message || "Datos inválidos",
        errors: parseA.error.issues,
      });
    }

    if (data.usuario_id) {
      const usuario = await get_usuario_id(data.usuario_id);
      if (!usuario) {
        throwError(errors.usuario_no_encontrado);
      }
    }

    const datos_para_guardar = {
      ...parseA.data,
      usuario_id: parseA.data.usuario_id || req.usuarios?.id || null,
      ip: parseA.data.ip || req.ip || req.connection?.remoteAddress || null,
      agente_usuario: parseA.data.agente_usuario || req.headers["user-agent"] || null,
    };

    const row = await post_auditoria(datos_para_guardar);
    return send_success(res, success_messages.auditoria_creada, row);
  } catch (error) {
    next(error);
  }
};
