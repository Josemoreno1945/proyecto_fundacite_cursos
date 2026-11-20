import {
  get_notificaciones,
  get_notificaciones_por_usuario,
  get_notificaciones_pendientes,
  get_notificacion_id,
  post_notificacion,
  marcar_notificacion_enviada,
  marcar_notificacion_fallida,
  filtro_notificaciones_por_canal,
} from "../models/notificaciones.models.js";

import { get_usuario_id } from "../models/usuarios.models.js";
import { get_taller_id } from "../models/talleres.models.js";

import notificacion_schemas from "../schemas/notificaciones.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_notificaciones_por_canal = async (req, res, next) => {
  try {
    const { canal } = req.query;
    if (!canal) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_notificaciones_por_canal(canal);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_notificaciones = async (req, res, next) => {
  try {
    const rows = await get_notificaciones();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_notificaciones_pendientes = async (req, res, next) => {
  try {
    const rows = await get_notificaciones_pendientes();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_notificaciones_propias = async (req, res, next) => {
  try {
    const id = req.usuarios.id;
    const rows = await get_notificaciones_por_usuario(id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_notificaciones_por_usuario = async (req, res, next) => {
  try {
    const usuario_id = req.params.usuario_id || req.params.id;
    if (!usuario_id) {
      throwError(errors.campos_faltantes);
    }

    const usuario = await get_usuario_id(usuario_id);
    if (!usuario) {
      throwError(errors.usuario_no_encontrado);
    }

    const rows = await get_notificaciones_por_usuario(usuario_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_notificacion_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const row = await get_notificacion_id(id);
    if (!row) {
      throwError(errors.notificacion_no_encontrada);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_notificacion = async (req, res, next) => {
  try {
    const data = req.body;

    const parseN = notificacion_schemas.safeParse(data);
    if (!parseN.success) {
      return res.status(400).json({
        error: parseN.error.issues[0]?.message || "Datos inválidos",
        errors: parseN.error.issues,
      });
    }

    //-------------------------------------------------------------
    const usuario = await get_usuario_id(data.usuario_id);
    if (!usuario) {
      throwError(errors.usuario_no_encontrado);
    }

    const taller = await get_taller_id(data.taller_id);
    if (!taller) {
      throwError(errors.taller_no_encontrado);
    }
    //--------------------------------------------------------------

    const row = await post_notificacion(parseN.data);
    return send_success(res, success_messages.notificacion_creada, row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Actualizar estado-----------------------------------------
export const c_marcar_notificacion_enviada = async (req, res, next) => {
  try {
    const id = req.params.id;
    const notificacion = await get_notificacion_id(id);
    if (!notificacion) {
      throwError(errors.notificacion_no_encontrada);
    }

    const row = await marcar_notificacion_enviada(id);
    return send_success(res, success_messages.notificacion_enviada, row);
  } catch (error) {
    next(error);
  }
};

export const c_marcar_notificacion_fallida = async (req, res, next) => {
  try {
    const id = req.params.id;
    const notificacion = await get_notificacion_id(id);
    if (!notificacion) {
      throwError(errors.notificacion_no_encontrada);
    }

    const row = await marcar_notificacion_fallida(id);
    return send_success(res, success_messages.notificacion_fallida, row);
  } catch (error) {
    next(error);
  }
};
