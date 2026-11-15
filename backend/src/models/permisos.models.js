import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_permisos = async () => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        p.descripcion
    FROM permisos p
    ORDER BY p.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_permiso_id = async (id) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        p.descripcion
    FROM permisos p
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_permiso_por_nombre = async (nombre, id = null) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        p.descripcion
    FROM permisos p
    WHERE unaccent(LOWER(p.nombre)) = unaccent(LOWER($1)) AND ($2::uuid IS NULL OR p.id != $2)
  `;
  const result = await pool.query(query, [nombre, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_permiso = async (data) => {
  const query = `
    INSERT INTO permisos(
        nombre,
        descripcion)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [
    data.nombre,
    data.descripcion ?? null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
