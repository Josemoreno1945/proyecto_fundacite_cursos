import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_menores = async () => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    ORDER BY m.primer_apellido ASC, m.primer_nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const get_menores_activos = async () => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    WHERE m.estado = 'activo'
    ORDER BY m.primer_apellido ASC, m.primer_nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const get_menores_inactivos = async () => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    WHERE m.estado = 'inactivo'
    ORDER BY m.primer_apellido ASC, m.primer_nombre ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por representante---------------------------------------
export const get_menores_por_representante = async (representante_id) => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    WHERE m.representante_id = $1
    ORDER BY m.primer_apellido ASC, m.primer_nombre ASC
  `;
  const result = await pool.query(query, [representante_id]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_menor_id = async (id) => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    WHERE m.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por cedula---------------------------------------
export const get_menor_por_cedula = async (cedula, id = null) => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    WHERE m.cedula = $1 AND ($2::uuid IS NULL OR m.id != $2)
  `;
  const result = await pool.query(query, [cedula, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_menor = async (data) => {
  const query = `
    INSERT INTO menores(
        representante_id,
        institucion_id,
        cedula,
        primer_nombre,
        primer_apellido,
        fecha_nacimiento,
        sexo,
        grado_escolar,
        estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    data.representante_id,
    data.institucion_id ?? null,
    data.cedula ?? null,
    data.primer_nombre,
    data.primer_apellido,
    data.fecha_nacimiento,
    data.sexo,
    data.grado_escolar,
    data.estado ?? "activo",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_menor = async (id, data) => {
  const columnas_permitidas = [
    "representante_id",
    "institucion_id",
    "cedula",
    "primer_nombre",
    "primer_apellido",
    "fecha_nacimiento",
    "sexo",
    "grado_escolar",
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
    UPDATE menores
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------ACTIVAR Y DESACTIVAR-----------------------------------------
export const desactivar_menor = async (id) => {
  const query = `
  UPDATE menores
  SET estado = 'inactivo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const activar_menor = async (id) => {
  const query = `
  UPDATE menores
  SET estado = 'activo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_nombre_menor = async (nombre) => {
  const query = `
    SELECT
        m.id,
        m.representante_id,
        u.nombre_usuario AS representante,
        m.institucion_id,
        i.nombre AS institucion,
        m.cedula,
        m.primer_nombre,
        m.primer_apellido,
        m.fecha_nacimiento,
        m.sexo,
        m.grado_escolar,
        m.estado
    FROM menores m
    JOIN usuarios u ON u.id = m.representante_id
    LEFT JOIN instituciones i ON i.id = m.institucion_id
    WHERE unaccent(LOWER(m.primer_nombre)) LIKE unaccent(LOWER('%' || $1 || '%'))
    OR unaccent(LOWER(m.primer_apellido)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY m.primer_apellido ASC, m.primer_nombre ASC
  `;
  const result = await pool.query(query, [nombre]);
  return result.rows;
};
