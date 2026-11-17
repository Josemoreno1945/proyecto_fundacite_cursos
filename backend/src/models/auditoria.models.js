import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_auditoria = async () => {
  const query = `
    SELECT
        a.id,
        u.nombre_usuario AS usuario,
        a.accion,
        a.modulo,
        a.tabla_afectada,
        a.registro_id,
        a.datos_anteriores,
        a.datos_nuevos,
        a.ip,
        a.agente_usuario,
        a.creado_en
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    ORDER BY a.creado_en DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_auditoria_id = async (id) => {
  const query = `
    SELECT
        a.id,
        u.nombre_usuario AS usuario,
        a.accion,
        a.modulo,
        a.tabla_afectada,
        a.registro_id,
        a.datos_anteriores,
        a.datos_nuevos,
        a.ip,
        a.agente_usuario,
        a.creado_en
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por usuario---------------------------------------
export const get_auditoria_por_usuario = async (usuario_id) => {
  const query = `
    SELECT
        a.id,
        u.nombre_usuario AS usuario,
        a.accion,
        a.modulo,
        a.tabla_afectada,
        a.registro_id,
        a.datos_anteriores,
        a.datos_nuevos,
        a.ip,
        a.agente_usuario,
        a.creado_en
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.usuario_id = $1
    ORDER BY a.creado_en DESC
  `;
  const result = await pool.query(query, [usuario_id]);
  return result.rows;
};

//-------------------------------Post-----------------------------------------
export const post_auditoria = async (data) => {
  const query = `
    INSERT INTO auditoria(
        usuario_id,
        accion,
        modulo,
        tabla_afectada,
        registro_id,
        datos_anteriores,
        datos_nuevos,
        ip,
        agente_usuario)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    data.usuario_id ?? null,
    data.accion,
    data.modulo,
    data.tabla_afectada,
    data.registro_id ?? null,
    data.datos_anteriores ? JSON.stringify(data.datos_anteriores) : null,
    data.datos_nuevos ? JSON.stringify(data.datos_nuevos) : null,
    data.ip ?? null,
    data.agente_usuario ?? null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_auditoria_por_modulo = async (modulo) => {
  const query = `
    SELECT
        a.id,
        u.nombre_usuario AS usuario,
        a.accion,
        a.modulo,
        a.tabla_afectada,
        a.datos_anteriores,
        a.datos_nuevos,
        a.ip,
        a.agente_usuario,
        a.creado_en
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE unaccent(LOWER(a.modulo)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY a.creado_en DESC
  `;
  const result = await pool.query(query, [modulo]);
  return result.rows;
};

export const filtro_auditoria_por_tabla = async (tabla_afectada) => {
  const query = `
    SELECT
        a.id,
        u.nombre_usuario AS usuario,
        a.accion,
        a.modulo,
        a.tabla_afectada,
        a.datos_anteriores,
        a.datos_nuevos,
        a.ip,
        a.agente_usuario,
        a.creado_en
    FROM auditoria a
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.tabla_afectada = $1
    ORDER BY a.creado_en DESC
  `;
  const result = await pool.query(query, [tabla_afectada]);
  return result.rows;
};
