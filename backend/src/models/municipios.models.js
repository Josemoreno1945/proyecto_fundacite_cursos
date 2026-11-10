import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_municipios = async () => {
  const query = `
    SELECT
        m.id,
        m.nombre,
        e.nombre AS estado,
        m.estado_id,
        m.creado_en,
        m.actualizado_en
    FROM municipios m
    JOIN estados e ON e.id = m.estado_id
    ORDER BY m.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por estado---------------------------------------
export const get_municipios_por_estado = async (estado_id) => {
  const query = `
    SELECT
        m.id,
        m.nombre,
        e.nombre AS estado,
        m.estado_id,
        m.creado_en,
        m.actualizado_en
    FROM municipios m
    JOIN estados e ON e.id = m.estado_id
    WHERE m.estado_id = $1
    ORDER BY m.nombre ASC
  `;
  const result = await pool.query(query, [estado_id]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_municipio_id = async (id) => {
  const query = `
    SELECT
        m.id,
        m.nombre,
        e.nombre AS estado,
        m.estado_id,
        m.creado_en,
        m.actualizado_en
    FROM municipios m
    JOIN estados e ON e.id = m.estado_id
    WHERE m.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_municipio_por_nombre = async (nombre, estado_id, id = null) => {
  const query = `
    SELECT
        m.id,
        m.nombre
    FROM municipios m
    WHERE LOWER(m.nombre) = LOWER($1)
      AND m.estado_id = $2
      AND ($3::uuid IS NULL OR m.id != $3)
  `;
  const result = await pool.query(query, [nombre, estado_id, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_municipio = async (data) => {
  const query = `
    INSERT INTO municipios(nombre, estado_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [data.nombre, data.estado_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_municipio = async (id, data) => {
  const columnas_permitidas = ["nombre", "estado_id"];

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
    UPDATE municipios
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_municipio = async (nombre) => {
  const query = `
    SELECT
        m.id,
        m.nombre,
        e.nombre AS estado,
        m.estado_id,
        m.creado_en,
        m.actualizado_en
    FROM municipios m
    JOIN estados e ON e.id = m.estado_id
    WHERE unaccent(LOWER(m.nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY m.nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};

