import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_estados = async () => {
  const query = `
    SELECT
        e.id,
        e.nombre,
        e.creado_en,
        e.actualizado_en
    FROM estados e
    ORDER BY e.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_estado_id = async (id) => {
  const query = `
    SELECT
        e.id,
        e.nombre,
        e.creado_en,
        e.actualizado_en
    FROM estados e
    WHERE e.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_estado_por_nombre = async (nombre, id = null) => {
  const query = `
    SELECT
        e.id,
        e.nombre
    FROM estados e
    WHERE LOWER(e.nombre) = LOWER($1) AND ($2::uuid IS NULL OR e.id != $2)
  `;
  const result = await pool.query(query, [nombre, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_estado = async (data) => {
  const query = `
    INSERT INTO estados(nombre)
    VALUES ($1)
    RETURNING *
  `;
  const values = [data.nombre];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_estado = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }
  if (fields.length === 0) return null;

  fields.push(`actualizado_en = NOW()`);
  values.push(id);

  const query = `
    UPDATE estados
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_estado = async (nombre) => {
  const query = `
    SELECT
        e.id,
        e.nombre,
        e.creado_en,
        e.actualizado_en
    FROM estados e
    WHERE unaccent(LOWER(e.nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY e.nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};

