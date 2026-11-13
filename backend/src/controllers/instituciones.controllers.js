import {
  get_instituciones,
  get_instituciones_activas,
  get_instituciones_inactivas,
  get_institucion_id,
  get_institucion_por_nombre,
  post_institucion,
  put_institucion,
  desactivar_institucion,
  activar_institucion,
  filtro_nombre_institucion,
  filtro_tipo_institucion,
} from "../models/instituciones.models.js";

import { get_parroquia_id } from "../models/parroquias.models.js";

import institucion_schemas from "../schemas/instituciones.schemas.js";
import institucion_put_schemas from "../schemas/instituciones_put.schemas.js";

import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_nombre_institucion = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_institucion(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_filtrar_tipo_institucion = async (req, res, next) => {
  try {
    const { tipo } = req.query;
    if (!tipo) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_tipo_institucion(tipo);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_instituciones = async (req, res, next) => {
  try {
    const rows = await get_instituciones();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_instituciones_activas = async (req, res, next) => {
  try {
    const rows = await get_instituciones_activas();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_instituciones_inactivas = async (req, res, next) => {
  try {
    const rows = await get_instituciones_inactivas();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_institucion_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_institucion_id(id);
    if (!rows) {
      throwError(errors.institucion_no_encontrada);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_institucion = async (req, res, next) => {
  try {
    const data = req.body;

    const parseI = institucion_schemas.safeParse(data);
    if (!parseI.success) {
      return res.status(400).json({
        errors: parseI.error.issues,
      });
    }

    //-------------------------------------------------------------
    const parroquia = await get_parroquia_id(data.parroquia_id);
    if (!parroquia) {
      throwError(errors.parroquia_no_encontrada);
    }

    const institucion_existe = await get_institucion_por_nombre(data.nombre);
    if (institucion_existe) {
      throwError(errors.institucion_duplicada);
    }
    //--------------------------------------------------------------

    await post_institucion(parseI.data);
    return send_success(res, success_messages.institucion_creada);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_institucion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseI = institucion_put_schemas.safeParse(data);
    if (!parseI.success) {
      return res.status(400).json({
        errors: parseI.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    const institucion_actual = await get_institucion_id(id);
    if (!institucion_actual) {
      throwError(errors.institucion_no_encontrada);
    }

    //--------------------------------------------------------------
    if (data.parroquia_id) {
      const parroquia = await get_parroquia_id(data.parroquia_id);
      if (!parroquia) {
        throwError(errors.parroquia_no_encontrada);
      }
    }

    //--------------------------------------------------------------
    if (data.nombre) {
      const institucion_existe = await get_institucion_por_nombre(data.nombre, id);
      if (institucion_existe) {
        throwError(errors.institucion_duplicada);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_institucion(id, parseI.data);
    if (!rows) {
      throwError(errors.institucion_no_encontrada);
    }
    return send_success(res, success_messages.institucion_actualizada);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Desactivar-----------------------------------------
export const c_desactivar_institucion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const institucion = await get_institucion_id(id);

    if (!institucion) {
      throwError(errors.institucion_no_encontrada);
    }

    await desactivar_institucion(id);
    return send_success(res, success_messages.institucion_desactivada);
  } catch (error) {
    next(error);
  }
};

//-------------------------------ACTIVAR-----------------------------------------
export const c_activar_institucion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const institucion = await get_institucion_id(id);

    if (!institucion) {
      throwError(errors.institucion_no_encontrada);
    }

    await activar_institucion(id);
    return send_success(res, success_messages.institucion_activada);
  } catch (error) {
    next(error);
  }
};

