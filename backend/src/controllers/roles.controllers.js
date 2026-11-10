import {
  get_roles,
  get_roles_activos,
  get_roles_inactivos,
  get_rol_id,
  get_rol_por_nombre,
  post_rol,
  put_rol,
  desactivar_rol,
  activar_rol,
  filtro_nombre_rol,
  get_permisos_de_rol,
  asignar_permiso_a_rol,
  quitar_permiso_de_rol,
  get_permiso_en_rol,
} from "../models/roles.models.js";

import roles_schemas from "../schemas/roles.schemas.js";
import roles_put_schemas from "../schemas/roles_put.schemas.js";
import { errors, throwError } from "../utils/errors.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_rol = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes);
    }
    const rows = await filtro_nombre_rol(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_roles = async (req, res, next) => {
  try {
    const rows = await get_roles();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_roles_activos = async (req, res, next) => {
  try {
    const rows = await get_roles_activos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_roles_inactivos = async (req, res, next) => {
  try {
    const rows = await get_roles_inactivos();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_rol_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_rol_id(id);
    if (!rows) {
      throwError(errors.rol_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_rol_por_nombre = async (req, res, next) => {
  try {
    const nombre = req.params.nombre;
    if (!nombre) {
      throwError(errors.rol_no_encontrado)
    }
    const rows = await get_rol_por_nombre(nombre);
    return res.json(rows)
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_rol = async (req, res, next) => {
  try {
    const data = req.body;

    const parseR = roles_schemas.safeParse(data);

    if (!parseR.success) {
      return res.status(400).json({
        errors: parseR.error.issues,
      });
    }

    //-------------------------------------------------------------
    const rol_existe = await get_rol_por_nombre(data.nombre);
    if (rol_existe) {
      throwError(errors.rol_duplicado);
    }
    //--------------------------------------------------------------

    const datos_para_guardar = {
      ...parseR.data,
      estado: parseR.data.estado,
    };

    const rows = await post_rol(datos_para_guardar);
    return res.json({ rows, message: "Rol registrado con exito" });
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_rol = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseR = roles_put_schemas.safeParse(data);

    if (!parseR.success) {
      return res.status(400).json({
        errors: parseR.error.issues,
      });
    }

    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    //--------------------------------------------------------------
    if (data.nombre) {
      const rol_existe = await get_rol_por_nombre(data.nombre, id);
      if (rol_existe) {
        throwError(errors.rol_duplicado);
      }
    }

    //--------------------------------------------------------------
    const rows = await put_rol(id, parseR.data);
    if (!rows) {
      throwError(errors.rol_no_encontrado);
    }
    return res.json({ rows, message: "Rol actualizado con éxito" });
  } catch (error) {
    next(error);
  }
};

//-------------------------------Desactivar-----------------------------------------
export const c_desactivar_rol = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rol_a_desactivar = await get_rol_id(id);

    if (!rol_a_desactivar) {
      throwError(errors.rol_no_encontrado)
    }

    if (
      rol_a_desactivar.nombre === "superadmin" ||
      rol_a_desactivar.nombre === "administrador"
    ) {
      throwError(errors.rol_protegido)
    }
    

    await desactivar_rol(id);
    return res.json({ message: "Rol desactivado" });
  } catch (error) {
    next(error);
  }
};

//-------------------------------ACTIVAR-----------------------------------------
export const c_activar_rol = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rol_a_activar = await get_rol_id(id);

    if (!rol_a_activar) {
      throwError(errors.rol_no_encontrado)
    }

    await activar_rol(id);
    return res.json({ message: "Rol activado" });
  } catch (error) {
    next(error);
  }
};

//-------------------------------PERMISOS DEL ROL-----------------------------------------
export const c_get_permisos_de_rol = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rol = await get_rol_id(id);

    if (!rol) {
      throwError(errors.rol_no_encontrado);
    }

    const rows = await get_permisos_de_rol(id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_asignar_permiso_a_rol = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { permiso_id } = req.body;

    if (!permiso_id) {
      throwError(errors.campos_faltantes);
    }

    const rol = await get_rol_id(id);
    if (!rol) {
      throwError(errors.rol_no_encontrado);
    }

    const ya_asignado = await get_permiso_en_rol(id, permiso_id);
    if (ya_asignado) {
      throwError(errors.permiso_ya_asignado);
    }

    const rows = await asignar_permiso_a_rol(id, permiso_id);
    return res.json({ rows, message: "Permiso asignado al rol con exito" });
  } catch (error) {
    next(error);
  }
};

export const c_quitar_permiso_de_rol = async (req, res, next) => {
  try {
    const { id, permiso_id } = req.params;

    const rol = await get_rol_id(id);
    if (!rol) {
      throwError(errors.rol_no_encontrado);
    }

    const rows = await quitar_permiso_de_rol(id, permiso_id);
    if (!rows) {
      throwError(errors.permiso_no_asignado)
    }
    return res.json({ message: "Permiso removido del rol con exito" });
  } catch (error) {
    next(error);
  }
};

