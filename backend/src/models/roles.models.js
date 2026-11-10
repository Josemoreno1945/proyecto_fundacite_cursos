import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_roles = async () => {
  const query = `
    SELECT
        r.id,
        r.nombre,
        r.descripcion,
        r.estado
    FROM roles r
    ORDER BY r.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const get_roles_activos = async () => {
  const query = `
    SELECT
        r.id,
        r.nombre,
        r.descripcion,
        r.estado
    FROM roles r
    WHERE r.estado = 'activo'
    ORDER BY r.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const get_roles_inactivos = async () => {
  const query = `
    SELECT
        r.id,
        r.nombre,
        r.descripcion,
        r.estado
    FROM roles r
    WHERE r.estado = 'inactivo'
    ORDER BY r.nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_rol_id = async (id) => {
  const query = `
    SELECT
        r.id,
        r.nombre,
        r.descripcion,
        r.estado
    FROM roles r
    WHERE r.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por nombre---------------------------------------
export const get_rol_por_nombre = async (nombre, id = null) => {
  const query = `
    SELECT
        r.id,
        r.nombre,
        r.descripcion,
        r.estado
    FROM roles r
    WHERE r.nombre::text = $1 AND ($2 IS NULL OR r.id != $2)
  `;
  const result = await pool.query(query, [nombre, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_rol = async (data) => {
  const query = `
    INSERT INTO roles(
    nombre,
    descripcion,
    estado)
    VALUES ( $1, $2, $3)
    RETURNING *
  `;

  const values = [
    data.nombre,
    data.descripcion,
    data.estado,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_rol = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key} = $${index}`);
    values.push(value);
    index++;
  }
  if (fields.length === 0) return null;

  values.push(id);

  const query = `
    UPDATE roles
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------ACTIVAR Y DESACTIVAR-----------------------------------------
export const desactivar_rol = async (id) => {
  const query = `
  UPDATE roles
  SET estado = 'inactivo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const activar_rol = async (id) => {
  const query = `
  UPDATE roles
  SET estado = 'activo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//-------------------------------FILTROS----------------------------------------
export const filtro_nombre_rol = async (nombre) => {
  const query = `
    SELECT
        r.id,
        r.nombre,
        r.descripcion,
        r.estado
    FROM roles r
    WHERE unaccent(LOWER(r.nombre::text)) LIKE unaccent(LOWER('%' || $1 || '%'))
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};

//-------------------------------PERMISOS DEL ROL-----------------------------------------
export const get_permisos_de_rol = async (rol_id) => {
  const query = `
    SELECT
        p.id,
        p.nombre,
        p.descripcion
    FROM permisos p
    JOIN rol_permisos rp ON rp.permiso_id = p.id
    WHERE rp.rol_id = $1
    ORDER BY p.nombre ASC
  `;
  const result = await pool.query(query, [rol_id]);
  return result.rows;
};

export const asignar_permiso_a_rol = async (rol_id, permiso_id) => {
  const query = `
    INSERT INTO rol_permisos(
    rol_id,
    permiso_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [rol_id, permiso_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const quitar_permiso_de_rol = async (rol_id, permiso_id) => {
  const query = `
    DELETE FROM rol_permisos
    WHERE rol_id = $1 AND permiso_id = $2
    RETURNING *
  `;
  const values = [rol_id, permiso_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const get_permiso_en_rol = async (rol_id, permiso_id) => {
  const query = `
    SELECT id
    FROM rol_permisos
    WHERE rol_id = $1 AND permiso_id = $2
  `;
  const result = await pool.query(query, [rol_id, permiso_id]);
  return result.rows[0];
};

