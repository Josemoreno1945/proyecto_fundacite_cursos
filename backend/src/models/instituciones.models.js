import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_instituciones = async () => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.parroquia_id
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.parroquia_id
    ORDER BY i.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const get_instituciones_activas = async () => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.parroquia_id,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.parroquia_id
    WHERE i.estado = 'activo'
    ORDER BY i.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const get_instituciones_inactivas = async () => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.parroquia_id,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.parroquia_id
    WHERE i.estado = 'inactivo'
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
        i.parroquia_id,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.parroquia_id
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
        i.nombre
    FROM instituciones i
    WHERE unaccent(LOWER(i.nombre)) = unaccent(LOWER($1)) AND ($2::uuid IS NULL OR i.id != $2)
  `;
  const result = await pool.query(query, [nombre, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_institucion = async (data) => {
  const query = `
    INSERT INTO instituciones(
        nombre,
        direccion,
        parroquia_id,
        tipo,
        estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    data.nombre,
    data.direccion,
    data.parroquia_id,
    data.tipo,
    data.estado,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_institucion = async (id, data) => {
  const columnas_permitidas = [
    "nombre",
    "direccion",
    "parroquia_id",
    "tipo",
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
    UPDATE instituciones
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------ACTIVAR Y DESACTIVAR-----------------------------------------
export const desactivar_institucion = async (id) => {
  const query = `
  UPDATE instituciones
  SET estado = 'inactivo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const activar_institucion = async (id) => {
  const query = `
  UPDATE instituciones
  SET estado = 'activo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_institucion = async (nombre) => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.parroquia_id,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.parroquia_id
    WHERE unaccent(LOWER(i.nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY i.nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};

export const filtro_tipo_institucion = async (tipo) => {
  const query = `
    SELECT
        i.id,
        i.nombre,
        i.direccion,
        p.nombre AS parroquia,
        i.parroquia_id,
        i.tipo,
        i.estado
    FROM instituciones i
    JOIN parroquias p ON p.id = i.parroquia_id
    WHERE i.tipo::text = $1
    ORDER BY i.nombre ASC
  `;
  const result = await pool.query(query, [tipo]);
  return result.rows;
};
