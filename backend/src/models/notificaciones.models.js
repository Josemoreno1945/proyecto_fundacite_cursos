import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_notificaciones = async () => {
  const query = `
    SELECT
        u.nombre_usuario AS usuario,
        t.nombre AS taller,
        n.tipo,
        n.mensaje,
        n.canal,
        n.destino,
        n.estado,
        n.enviado_en
    FROM notificaciones n
    JOIN usuarios u ON u.id = n.usuario_id
    JOIN talleres t ON t.id = n.taller_id
    ORDER BY n.id DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por usuario---------------------------------------
export const get_notificaciones_por_usuario = async (usuario_id) => {
  const query = `
    SELECT
        t.nombre AS taller,
        n.tipo,
        n.mensaje,
        n.canal,
        n.destino,
        n.estado,
        n.enviado_en
    FROM notificaciones n
    JOIN talleres t ON t.id = n.taller_id
    WHERE n.usuario_id = $1
    ORDER BY n.id DESC
  `;
  const result = await pool.query(query, [usuario_id]);
  return result.rows;
};

//---------------------------------Get pendientes (para cron / jobs de envio)---------------------------------------
export const get_notificaciones_pendientes = async () => {
  const query = `
    SELECT
        n.id,
        u.nombre_usuario AS usuario,
        t.nombre AS taller,
        n.tipo,
        n.mensaje,
        n.canal,
        n.destino,
        n.estado
    FROM notificaciones n
    JOIN usuarios u ON u.id = n.usuario_id
    JOIN talleres t ON t.id = n.taller_id
    WHERE n.estado = 'pendiente'
    ORDER BY n.id ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_notificacion_id = async (id) => {
  const query = `
    SELECT
        u.nombre_usuario AS usuario,
        t.nombre AS taller,
        n.tipo,
        n.mensaje,
        n.canal,
        n.destino,
        n.estado,
        n.enviado_en
    FROM notificaciones n
    JOIN usuarios u ON u.id = n.usuario_id
    JOIN talleres t ON t.id = n.taller_id
    WHERE n.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_notificacion = async (data) => {
  const query = `
    INSERT INTO notificaciones(
        usuario_id,
        taller_id,
        tipo,
        mensaje,
        canal,
        destino,
        estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [
    data.usuario_id,
    data.taller_id,
    data.tipo,
    data.mensaje,
    data.canal,
    data.destino,
    data.estado ?? "pendiente",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Actualizar estado-----------------------------------------
export const marcar_notificacion_enviada = async (id) => {
  const query = `
    UPDATE notificaciones
    SET estado = 'enviado', enviado_en = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const marcar_notificacion_fallida = async (id) => {
  const query = `
    UPDATE notificaciones
    SET estado = 'fallido'
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_notificaciones_por_canal = async (canal) => {
  const query = `
    SELECT
        u.nombre_usuario AS usuario,
        t.nombre AS taller,
        n.tipo,
        n.mensaje,
        n.canal,
        n.destino,
        n.estado,
        n.enviado_en
    FROM notificaciones n
    JOIN usuarios u ON u.id = n.usuario_id
    JOIN talleres t ON t.id = n.taller_id
    WHERE n.canal::text = $1
    ORDER BY n.id DESC
  `;
  const result = await pool.query(query, [canal]);
  return result.rows;
};
