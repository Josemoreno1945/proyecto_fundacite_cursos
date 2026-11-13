import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_talleres = async () => {
  const query = `
    SELECT
        t.id,
        t.nombre,
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    ORDER BY t.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};


export const get_talleres_por_estado = async (estado) => {
  const query = `
    SELECT
        t.id,
        t.nombre,
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    WHERE t.estado::text = $1
    ORDER BY t.nombre ASC
  `;
  const result = await pool.query(query, [estado]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_taller_id = async (id) => {
  const query = `
    SELECT
        t.id,
        t.nombre,
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario,
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    WHERE t.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_taller_por_nombre = async (nombre, id = null) => {
  const query = `
    SELECT
        t.id,
        t.nombre
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario,
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    WHERE unaccent(LOWER(t.nombre)) = unaccent(LOWER($1)) AND ($2::uuid IS NULL OR t.id != $2)
  `;
  const result = await pool.query(query, [nombre, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_taller = async (data) => {
  const query = `
    INSERT INTO talleres(
        nombre,
        descripcion,
        area,
        dirigido_a,
        total_horas,
        cupos_totales,
        cupos_disponibles,
        estado,
        creado_por)
    VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    data.nombre,
    data.descripcion ?? null,
    data.area ?? "otro",
    data.dirigido_a,
    data.total_horas ?? 0,
    data.cupos_totales,
    data.estado ?? "activo",
    data.creado_por,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_taller = async (id, data) => {
  const columnas_permitidas = [
    "nombre",
    "descripcion",
    "area",
    "dirigido_a",
    "total_horas",
    "cupos_totales",
    "cupos_disponibles",
    "estado",
  ];

  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    if (columnas_permitidas.includes(key)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }
  if (fields.length === 0) return null;

  fields.push(`actualizado_en = NOW()`);
  values.push(id);

  const query = `
    UPDATE talleres
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Cambiar estado-----------------------------------------
export const cambiar_estado_taller = async (id, estado) => {
  const query = `
  UPDATE talleres
  SET estado = $1, actualizado_en = NOW()
  WHERE id = $2
  RETURNING *;
  `;
  const result = await pool.query(query, [estado, id]);
  return result.rows[0];
};

//-------------------------------Descontar / restaurar cupo-----------------------------------------
export const descontar_cupo = async (id) => {
  const query = `
  UPDATE talleres
  SET cupos_disponibles = cupos_disponibles - 1, actualizado_en = NOW()
  WHERE id = $1 AND cupos_disponibles > 0
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const restaurar_cupo = async (id) => {
  const query = `
  UPDATE talleres
  SET cupos_disponibles = cupos_disponibles + 1, actualizado_en = NOW()
  WHERE id = $1 AND cupos_disponibles < cupos_totales
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_taller = async (nombre) => {
  const query = `
    SELECT
        t.id,
        t.nombre,
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario,
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    WHERE unaccent(LOWER(t.nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY t.nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};

export const filtro_area_taller = async (area) => {
  const query = `
    SELECT
        t.id,
        t.nombre,
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario,
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    WHERE t.area::text = $1
    ORDER BY t.nombre ASC
  `;
  const result = await pool.query(query, [area]);
  return result.rows;
};

export const filtro_dirigido_a_taller = async (dirigido_a) => {
  const query = `
    SELECT
        t.id,
        t.nombre,
        t.descripcion,
        t.area,
        t.dirigido_a,
        t.total_horas,
        t.cupos_totales,
        t.cupos_disponibles,
        t.estado,
        t.creado_por,
        u.nombre_usuario AS creado_por_usuario,
    FROM talleres t
    JOIN usuarios u ON u.id = t.creado_por
    WHERE t.dirigido_a::text = $1
    ORDER BY t.nombre ASC
  `;
  const result = await pool.query(query, [dirigido_a]);
  return result.rows;
};
