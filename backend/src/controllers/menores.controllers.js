import {
  get_menores,
  get_menores_activos,
  get_menores_inactivos,
  get_menores_por_representante,
  get_menor_id,
  get_menor_por_cedula,
  post_menor,
  put_menor,
  desactivar_menor,
  activar_menor,
  filtro_nombre_menor,
} from "../models/menores.models.js";

import { get_usuario_id } from "../models/usuarios.models.js";
import { get_institucion_id } from "../models/instituciones.models.js";

import menor_schemas from "../schemas/menores.schemas.js";
import menor_put_schemas from "../schemas/menores_put.schemas.js";

import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_menor = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_menor(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_menores = async (req, res, next) => {
  try {
    const rows = await get_menores();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_menores_activos = async (req, res, next) => {
  try {
    const rows = await get_menores_activos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_menores_inactivos = async (req, res, next) => {
  try {
    const rows = await get_menores_inactivos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_menores_por_representante = async (req, res, next) => {
  try {
    const representante_id = req.params.representante_id;
    const representante = await get_usuario_id(representante_id);
    if (!representante) {
      throwError(errors.usuario_no_encontrado);
    }
    const rows = await get_menores_por_representante(representante_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_menores_propios = async (req, res, next) => {
  try {
    const representante_id = req.usuarios.id;
    const rows = await get_menores_por_representante(representante_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_menor_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_menor_id(id);
    if (!rows) {
      throwError(errors.menor_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_menor = async (req, res, next) => {
  try {
    const data = req.body;

    const parseM = menor_schemas.safeParse(data);
    if (!parseM.success) {
      return res.status(400).json({
        errors: parseM.error.issues,
      });
    }

    //-------------------------------------------------------------
    const representante = await get_usuario_id(data.representante_id);
    if (!representante) {
      throwError(errors.usuario_no_encontrado);
    }

    if (data.institucion_id) {
      const institucion = await get_institucion_id(data.institucion_id);
      if (!institucion) {
        throwError(errors.institucion_no_encontrada);
      }
    }

    if (data.cedula) {
      const cedula_existe = await get_menor_por_cedula(data.cedula);
      if (cedula_existe) {
        throwError(errors.menor_cedula_duplicada);
      }
    }
    //--------------------------------------------------------------

    await post_menor(parseM.data);
    return send_success(res, success_messages.menor_creado);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_menor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseM = menor_put_schemas.safeParse(data);
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
    const menor_actual = await get_menor_id(id);
    if (!menor_actual) {
      throwError(errors.menor_no_encontrado);
    }

    //--------------------------------------------------------------
    if (data.representante_id) {
      const representante = await get_usuario_id(data.representante_id);
      if (!representante) {
        throwError(errors.usuario_no_encontrado);
      }
    }

    if (data.institucion_id) {
      const institucion = await get_institucion_id(data.institucion_id);
      if (!institucion) {
        throwError(errors.institucion_no_encontrada);
      }
    }

    if (data.cedula) {
      const cedula_existe = await get_menor_por_cedula(data.cedula, id);
      if (cedula_existe) {
        throwError(errors.menor_cedula_duplicada);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_menor(id, parseM.data);
    if (!rows) {
      throwError(errors.menor_no_encontrado);
    }
    return send_success(res, success_messages.menor_actualizado);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Desactivar-----------------------------------------
export const c_desactivar_menor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const menor = await get_menor_id(id);

    if (!menor) {
      throwError(errors.menor_no_encontrado);
    }

    await desactivar_menor(id);
    return send_success(res, success_messages.menor_desactivado);
  } catch (error) {
    next(error);
  }
};

//-------------------------------ACTIVAR-----------------------------------------
export const c_activar_menor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const menor = await get_menor_id(id);

    if (!menor) {
      throwError(errors.menor_no_encontrado);
    }

    await activar_menor(id);
    return send_success(res, success_messages.menor_activado);
  } catch (error) {
    next(error);
  }
};
