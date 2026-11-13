import {
  get_talleres,
  get_talleres_activos,
  get_talleres_por_estado,
  get_taller_id,
  get_taller_por_nombre,
  post_taller,
  put_taller,
  cambiar_estado_taller,
  filtro_nombre_taller,
  filtro_area_taller,
  filtro_dirigido_a_taller,
} from "../models/talleres.models.js";

import taller_schemas from "../schemas/talleres.schemas.js";
import taller_put_schemas from "../schemas/talleres_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_nombre_taller = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_taller(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_filtrar_area_taller = async (req, res, next) => {
  try {
    const { area } = req.query;
    if (!area) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_area_taller(area);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_filtrar_dirigido_a = async (req, res, next) => {
  try {
    const { dirigido_a } = req.query;
    if (!dirigido_a) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_dirigido_a_taller(dirigido_a);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_talleres = async (req, res, next) => {
  try {
    const rows = await get_talleres();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_talleres_activos = async (req, res, next) => {
  try {
    const rows = await get_talleres_activos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_talleres_por_estado = async (req, res, next) => {
  try {
    const { estado } = req.query;
    if (!estado) {
      throwError(errors.campos_faltantes);
    }
    const rows = await get_talleres_por_estado(estado);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_taller_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_taller_id(id);
    if (!rows) {
      throwError(errors.taller_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_taller = async (req, res, next) => {
  try {
    const data = req.body;

    const parseT = taller_schemas.safeParse(data);
    if (!parseT.success) {
      return res.status(400).json({
        errors: parseT.error.issues,
      });
    }

    //-------------------------------------------------------------
    const taller_existe = await get_taller_por_nombre(data.nombre);
    if (taller_existe) {
      throwError(errors.taller_duplicado);
    }
    //--------------------------------------------------------------

    const datos_para_guardar = {
      ...parseT.data,
      creado_por: req.usuarios.id,
    };

    await post_taller(datos_para_guardar);
    return send_success(res, success_messages.taller_creado);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_taller = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseT = taller_put_schemas.safeParse(data);
    if (!parseT.success) {
      return res.status(400).json({
        errors: parseT.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    const taller_actual = await get_taller_id(id);
    if (!taller_actual) {
      throwError(errors.taller_no_encontrado);
    }

    //--------------------------------------------------------------
    if (data.nombre) {
      const taller_existe = await get_taller_por_nombre(data.nombre, id);
      if (taller_existe) {
        throwError(errors.taller_duplicado);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_taller(id, parseT.data);
    if (!rows) {
      throwError(errors.taller_no_encontrado);
    }
    return send_success(res, success_messages.taller_actualizado);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Cambiar estado-----------------------------------------
export const c_cambiar_estado_taller = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;

    if (!estado) {
      throwError(errors.campos_faltantes);
    }

    const taller = await get_taller_id(id);
    if (!taller) {
      throwError(errors.taller_no_encontrado);
    }

    const estados_validos = ["activo", "inactivo", "en_curso", "culminado", "cancelado"];
    if (!estados_validos.includes(estado)) {
      throwError(errors.datos_invalidos);
    }

    await cambiar_estado_taller(id, estado);
    return send_success(res, success_messages.taller_estado_actualizado);
  } catch (error) {
    next(error);
  }
};
