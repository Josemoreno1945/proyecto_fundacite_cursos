import {
  get_inscripciones,
  get_inscripciones_por_taller,
  get_inscripciones_por_usuario,
  get_inscripciones_por_menor,
  get_inscripcion_id,
  verificar_inscripcion_adulto,
  verificar_inscripcion_menor,
  post_inscripcion,
  put_inscripcion,
  cambiar_estado_inscripcion,
  filtro_estado_inscripcion,
} from "../models/inscripciones.models.js";

import {
  get_taller_id,
  descontar_cupo,
  restaurar_cupo,
} from "../models/talleres.models.js";

import { get_usuario_id } from "../models/usuarios.models.js";
import { get_menor_id } from "../models/menores.models.js";

import inscripcion_schemas, {
  inscripcion_put_schemas,
} from "../schemas/inscripciones.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_estado_inscripcion = async (req, res, next) => {
  try {
    const { estado } = req.query;
    if (!estado) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_estado_inscripcion(estado);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_inscripciones = async (req, res, next) => {
  try {
    const rows = await get_inscripciones();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_inscripciones_por_taller = async (req, res, next) => {
  try {
    const taller_id = req.params.taller_id || req.params.id;
    if (!taller_id) {
      throwError(errors.campos_faltantes);
    }

    const taller = await get_taller_id(taller_id);
    if (!taller) {
      throwError(errors.taller_no_encontrado);
    }

    const rows = await get_inscripciones_por_taller(taller_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_inscripciones_por_usuario = async (req, res, next) => {
  try {
    const usuario_id = req.params.usuario_id || req.params.id;
    if (!usuario_id) {
      throwError(errors.campos_faltantes);
    }

    const usuario = await get_usuario_id(usuario_id);
    if (!usuario) {
      throwError(errors.usuario_no_encontrado);
    }

    const rows = await get_inscripciones_por_usuario(usuario_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_inscripciones_por_menor = async (req, res, next) => {
  try {
    const menor_id = req.params.menor_id || req.params.id;
    if (!menor_id) {
      throwError(errors.campos_faltantes);
    }

    const menor = await get_menor_id(menor_id);
    if (!menor) {
      throwError(errors.menor_no_encontrado);
    }

    const rows = await get_inscripciones_por_menor(menor_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_inscripcion_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const row = await get_inscripcion_id(id);
    if (!row) {
      throwError(errors.inscripcion_no_encontrada);
    }
    res.json(row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_inscripcion = async (req, res, next) => {
  try {
    const data = req.body;

    const parseI = inscripcion_schemas.safeParse(data);
    if (!parseI.success) {
      return res.status(400).json({
        error: parseI.error.issues[0]?.message || "Datos inválidos",
        errors: parseI.error.issues,
      });
    }

    //-------------------------------------------------------------
    // 1. Validar existencia y disponibilidad del taller
    const taller = await get_taller_id(parseI.data.taller_id);
    if (!taller) {
      throwError(errors.taller_no_encontrado);
    }

    if (taller.estado !== "activo") {
      throwError(errors.taller_inactivo);
    }

    if (taller.cupos_disponibles <= 0) {
      throwError(errors.taller_sin_cupos);
    }

    //-------------------------------------------------------------
    // 2. Validar participante y evitar duplicados
    if (parseI.data.usuario_id) {
      const usuario = await get_usuario_id(parseI.data.usuario_id);
      if (!usuario) {
        throwError(errors.usuario_no_encontrado);
      }

      const ya_inscrito = await verificar_inscripcion_adulto(
        parseI.data.taller_id,
        parseI.data.usuario_id
      );
      if (ya_inscrito) {
        throwError(errors.inscripcion_duplicada);
      }
    } else if (parseI.data.menor_id) {
      const menor = await get_menor_id(parseI.data.menor_id);
      if (!menor) {
        throwError(errors.menor_no_encontrado);
      }

      const ya_inscrito = await verificar_inscripcion_menor(
        parseI.data.taller_id,
        parseI.data.menor_id
      );
      if (ya_inscrito) {
        throwError(errors.inscripcion_duplicada);
      }
    }

    //-------------------------------------------------------------
    // 3. Registrar inscripción y descontar cupo
    const datos_para_guardar = {
      ...parseI.data,
      inscrito_por: req.usuarios.id,
    };

    const row = await post_inscripcion(datos_para_guardar);
    await descontar_cupo(parseI.data.taller_id);

    return send_success(res, success_messages.inscripcion_creada, row);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_inscripcion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseI = inscripcion_put_schemas.safeParse(data);
    if (!parseI.success) {
      return res.status(400).json({
        error: parseI.error.issues[0]?.message || "Datos inválidos",
        errors: parseI.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    const inscripcion_actual = await get_inscripcion_id(id);
    if (!inscripcion_actual) {
      throwError(errors.inscripcion_no_encontrada);
    }

    //--------------------------------------------------------------
    const row = await put_inscripcion(id, parseI.data);
    if (!row) {
      throwError(errors.inscripcion_no_encontrada);
    }

    return send_success(res, success_messages.inscripcion_actualizada, row);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Cambiar estado-----------------------------------------
export const c_cambiar_estado_inscripcion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;

    if (!estado) {
      throwError(errors.campos_faltantes);
    }

    const inscripcion_actual = await get_inscripcion_id(id);
    if (!inscripcion_actual) {
      throwError(errors.inscripcion_no_encontrada);
    }

    const estados_validos = ["confirmado", "cancelado", "lista_espera"];
    if (!estados_validos.includes(estado)) {
      throwError(errors.datos_invalidos);
    }

    const row = await cambiar_estado_inscripcion(id, estado);
    if (!row) {
      throwError(errors.inscripcion_no_encontrada);
    }

    // Ajuste dinámico de cupos en el taller según el cambio de estado
    if (inscripcion_actual.estado !== "cancelado" && estado === "cancelado") {
      await restaurar_cupo(row.taller_id);
    } else if (inscripcion_actual.estado === "cancelado" && estado === "confirmado") {
      await descontar_cupo(row.taller_id);
    }

    return send_success(res, success_messages.inscripcion_estado_actualizado, row);
  } catch (error) {
    next(error);
  }
};
