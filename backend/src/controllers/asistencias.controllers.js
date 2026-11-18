import {
  get_asistencias_por_clase,
  get_asistencias_por_inscripcion,
  get_asistencia_id,
  get_asistencia_por_clase_e_inscripcion,
  post_asistencia,
  put_asistencia,
  filtro_asistencia_por_estado
} from "../models/asistencias.models.js";


import asistencia_schemas from "../schemas/asistencias.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";


//normalizar una sola manera de sacar datos , osea , req-query , req.body

//---------------------------------Filtros------------------------------------
export const c_filtrar_asistencia_por_estado = async (req, res, next) => {
  try {
    const { clase_id , asistio } = req.query;
    if (!clase_id || !asistio) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_asistencia_por_estado(clase_id , asistio);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_asistencias_por_clase = async (req, res, next) => {
  try {
    const { clase_id } = req.query;
    if (!clase_id) {
      throwError(errors.campos_faltantes);
    }

    const rows = await get_asistencias_por_clase(clase_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_asistencias_por_inscripcion = async (req, res, next) => {
  try {
    const { inscripcion_id } = req.query;
    if (!inscripcion_id) {
      throwError(errors.campos_faltantes);
    }
    const rows = await get_asistencias_por_inscripcion(inscripcion_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_clases_por_estado = async (req, res, next) => {
  try {
    const estado = req.params.estado || req.query.estado;
    if (!estado) {
      throwError(errors.campos_faltantes);
    }
    const rows = await get_clases_por_estado(estado);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_clase_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_clase_id(id);
    if (!rows) {
      throwError(errors.clase_no_encontrada);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------FACILITADORES DE CLASE-----------------------------------------
export const c_get_facilitadores_de_clase = async (req, res, next) => {
  try {
    const clase_id = req.params.clase_id || req.params.id;
    if (!clase_id) {
      throwError(errors.campos_faltantes);
    }

    const clase = await get_clase_id(clase_id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const rows = await get_facilitadores_de_clase(clase_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_facilitador_en_clase = async (req, res, next) => {
  try {
    const clase_id = req.params.clase_id || req.query.clase_id;
    const facilitador_id = req.params.facilitador_id || req.query.facilitador_id;

    if (!clase_id || !facilitador_id) {
      throwError(errors.campos_faltantes);
    }

    const clase = await get_clase_id(clase_id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const rows = await get_facilitador_en_clase(clase_id, facilitador_id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_asignar_facilitador_a_clase = async (req, res, next) => {
  try {
    const clase_id = req.params.clase_id || req.params.id;
    const facilitador_id = req.body.facilitador_id || req.params.facilitador_id;

    if (!clase_id || !facilitador_id) {
      throwError(errors.campos_faltantes);
    }

    const clase = await get_clase_id(clase_id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const facilitador = await get_usuario_id(facilitador_id);
    if (!facilitador) {
      throwError(errors.usuario_no_encontrado);
    }

    const ya_asignado = await get_facilitador_en_clase(clase_id, facilitador_id);
    if (ya_asignado) {
      throwError(errors.facilitador_ya_asignado_a_clase);
    }

    const row = await asignar_facilitador_a_clase(clase_id, facilitador_id);
    return send_success(res, success_messages.facilitador_asignado_a_clase, row);
  } catch (error) {
    next(error);
  }
};

export const c_quitar_facilitador_a_clase = async (req, res, next) => {
  try {
    const clase_id = req.params.clase_id || req.params.id;
    const facilitador_id = req.params.facilitador_id || req.body.facilitador_id;

    if (!clase_id || !facilitador_id) {
      throwError(errors.campos_faltantes);
    }

    const clase = await get_clase_id(clase_id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const ya_asignado = await get_facilitador_en_clase(clase_id, facilitador_id);
    if (!ya_asignado) {
      throwError(errors.facilitador_no_asignado_a_clase);
    }

    await quitar_facilitador_de_clase(clase_id, facilitador_id);
    return send_success(res, success_messages.facilitador_removido_de_clase);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_clases = async (req, res, next) => {
  try {
    const data = req.body;

    const parseC = clases_schemas.safeParse(data);
    if (!parseC.success) {
      return res.status(400).json({
        error: parseC.error.issues[0]?.message || "Datos inválidos",
        errors: parseC.error.issues,
      });
    }

    //-------------------------------------------------------------
    const taller = await get_taller_id(data.taller_id);
    if (!taller) {
      throwError(errors.taller_no_encontrado);
    }

    const numero_existe = await get_clase_por_numero(data.taller_id, data.numero_clase);
    if (numero_existe) {
      throwError(errors.clase_numero_duplicado);
    }
    //--------------------------------------------------------------

    const datos_para_guardar = {
      ...parseC.data,
    };

    const row = await post_clase(datos_para_guardar);
    return send_success(res, success_messages.clase_creada, row);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_clases = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseC = clases_put_schemas.safeParse(data);
    if (!parseC.success) {
      return res.status(400).json({
        error: parseC.error.issues[0]?.message || "Datos inválidos",
        errors: parseC.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    const clase_actual = await get_clase_id(id);
    if (!clase_actual) {
      throwError(errors.clase_no_encontrada);
    }

    //--------------------------------------------------------------
    // Solo se puede editar si la clase está en estado 'pendiente'
    if (clase_actual.estado !== "pendiente") {
      throwError(errors.clase_no_editable);
    }

    //--------------------------------------------------------------
    // Inmutabilidad: no se permite cambiar el taller_id
    if (parseC.data.taller_id && parseC.data.taller_id !== clase_actual.taller_id) {
      throwError(errors.clase_taller_inmutable);
    }
    delete parseC.data.taller_id;

    //--------------------------------------------------------------
    if (data.numero_clase) {
      const numero_existe = await get_clase_por_numero(clase_actual.taller_id, data.numero_clase, id);
      if (numero_existe) {
        throwError(errors.clase_numero_duplicado);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_clase(id, parseC.data);
    if (!rows) {
      throwError(errors.clase_no_encontrada);
    }
    return send_success(res, success_messages.clase_actualizada, rows);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Cambiar estado-----------------------------------------
export const c_cambiar_estado_clase = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;

    if (!estado) {
      throwError(errors.campos_faltantes);
    }

    const clase = await get_clase_id(id);
    if (!clase) {
      throwError(errors.clase_no_encontrada);
    }

    const estados_validos = ["pendiente", "en_curso", "culminada", "cancelada"];
    if (!estados_validos.includes(estado)) {
      throwError(errors.datos_invalidos);
    }

    const row = await cambiar_estado_clase(id, estado);
    return send_success(res, success_messages.clase_estado_actualizado, row);
  } catch (error) {
    next(error);
  }
};
