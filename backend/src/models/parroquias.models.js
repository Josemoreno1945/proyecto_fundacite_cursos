import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_parroquias = async () => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        m.nombre AS municipio,
        p.municipio_id,
        p.creado_en,
        p.actualizado_en
    FROM parroquias p
    JOIN municipios m ON m.id = p.municipio_id
    ORDER BY p.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por municipio---------------------------------------
export const get_parroquias_por_municipio = async (municipio_id) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        m.nombre AS municipio,
        p.municipio_id,
        p.creado_en,
        p.actualizado_en
    FROM parroquias p
    JOIN municipios m ON m.id = p.municipio_id
    WHERE p.municipio_id = $1
    ORDER BY p.nombre ASC
  `;
  const result = await pool.query(query, [municipio_id]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_parroquia_id = async (id) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        m.nombre AS municipio,
        p.municipio_id,
        p.creado_en,
        p.actualizado_en
    FROM parroquias p
    JOIN municipios m ON m.id = p.municipio_id
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_parroquia_por_nombre = async (nombre, municipio_id, id = null) => {
  const query = `
    SELECT
        p.id,
        p.nombre
    FROM parroquias p
    WHERE LOWER(p.nombre) = LOWER($1)
      AND p.municipio_id = $2
      AND ($3::uuid IS NULL OR p.id != $3)
  `;
  const result = await pool.query(query, [nombre, municipio_id, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_parroquia = async (data) => {
  const query = `
    INSERT INTO parroquias(nombre, municipio_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [data.nombre, data.municipio_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_parroquia = async (id, data) => {
  const columnas_permitidas = ["nombre", "municipio_id"];

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
    UPDATE parroquias
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_parroquia = async (nombre) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        m.nombre AS municipio,
        p.municipio_id,
        p.creado_en,
        p.actualizado_en
    FROM parroquias p
    JOIN municipios m ON m.id = p.municipio_id
    WHERE unaccent(LOWER(p.nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY p.nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};
