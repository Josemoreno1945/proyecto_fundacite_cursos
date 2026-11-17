import {
  get_permisos,
  get_permiso_id,
  get_permiso_por_nombre,
  post_permiso
} from "../models/permisos.models.js";


import clases_schemas from "../schemas/clases.schemas.js";
import clases_put_schemas from "../schemas/clases_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtros------------------------------------
export const c_filtrar_titulo_clase = async (req, res, next) => {
  try {
    const { titulo } = req.query;
    if (!titulo) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_titulo_clase(titulo);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};



//---------------------------------Get---------------------------------------
export const c_get_clases = async (req, res, next) => {
  try {
    const rows = await get_clases();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_clases_por_taller = async (req, res, next) => {
  try {
    const taller_id = req.params.taller_id || req.params.id;
    if (!taller_id) {
      throwError(errors.campos_faltantes);
    }

    const taller = await get_taller_id(taller_id);
    if (!taller) {
      throwError(errors.taller_no_encontrado);
    }
    const rows = await get_clases_por_taller(taller_id);
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

export const c_get_facilicitador_en_clase = async (req, res, next) => {
  try {
    const clase = req.params.clase_id || req.query.clase_id
    if (!clase){
      pass
    }

    const facilitador = req.params.facilitador_id || req.query.facilitador_id;
    if (!clase) {
      pass
    }
    const rows = await get_facilitador_en_clase(clase,facilitador);
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

//---------------------------------------------------------------------------

export const c_asignar_facilicitador_a_clase = async (req, res, next) => {
  try {
    const clase = req.params.clase_id || req.query.clase_id
    if (!clase){
      pass
    }
    
    const facilitador = req.params.facilitador_id || req.query.facilitador_id;
    if (!clase) {
      pass
    }
    const rows = await asignar_facilitador_a_clase(clase,facilitador);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_quitar_facilicitador_a_clase = async (req, res, next) => {
  try {
    const clase = req.params.clase_id || req.query.clase_id
    if (!clase){
      pass
    }
    
    const facilitador = req.params.facilitador_id || req.query.facilitador_id;
    if (!clase) {
      pass
    }
    const rows = await quitar_facilitador_de_clase(clase,facilitador);
    res.json(rows);
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
        errors: parseC.error.issues,
      });
    }


    //-------------------------------------------------------------
    const numero_existe = await get_clase_por_numero(data.taller_id, data.numero_clase);
    if (numero_existe) {
      throwError(errors.clase_numero_duplicado);
    }
    //--------------------------------------------------------------

    const datos_para_guardar = {
      ...parseC.data,
      creado_por: req.usuarios.id,
    };

    await post_clase(datos_para_guardar);
    return send_success(res, success_messages.clase_creada);
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

    //como se adapta esto a clases o no va ????????
    if (data.nombre) {
      const taller_existe = await get_taller_por_nombre(data.nombre, id);
      if (taller_existe) {
        throwError(errors.taller_duplicado);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_clase(id, parseC.data);
    if (!rows) {
      throwError(errors.clase_no_encontrada);
    }
    return send_success(res, success_messages.clase_actualizada);
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

    await cambiar_estado_clase(id, estado);
    return send_success(res, success_messages.clase_estado_actualizado);
  } catch (error) {
    next(error);
  }
};
