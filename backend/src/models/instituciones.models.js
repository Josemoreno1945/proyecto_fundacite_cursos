import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_instituciones = async () => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.id
    ORDER BY i.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_institucion_id = async (id) => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.id
    WHERE i.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_institucion_por_nombre = async (nombre, id = null) => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.id
    WHERE unaccent(LOWER(i.nombre)) = unaccent(LOWER($1)) AND ($2::uuid IS NULL OR i.id != $2)
  `;
  const result = await pool.query(query, [nombre, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_profesion = async (data) => {
  const query = `
    INSERT INTO profesiones(
    nombre)
    VALUES ($1)
    RETURNING *
  `;
  const values = [data.nombre];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_profesion = async (id, data) => {
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
    UPDATE profesiones
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_profesion = async (nombre) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
    FROM profesiones p
    WHERE unaccent(LOWER(p.nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY p.nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};

