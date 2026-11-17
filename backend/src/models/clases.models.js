import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_clases = async () => {
  const query = `
    SELECT
        c.id,
        t.nombre AS taller,
        c.numero_clase,
        c.titulo,
        c.descripcion,
        c.fecha,
        c.hora_inicio,
        c.hora_fin,
        c.modalidad,
        i.nombre AS institucion,
        c.enlace_acceso,
        c.estado
    FROM clases c
    JOIN talleres t ON t.id = c.taller_id
    LEFT JOIN instituciones i ON i.id = c.institucion_id
    ORDER BY c.fecha ASC, c.hora_inicio ASC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por taller---------------------------------------
export const get_clases_por_taller = async (taller_id) => {
  const query = `
    SELECT
        c.id,
        t.nombre AS taller,
        c.numero_clase,
        c.titulo,
        c.descripcion,
        c.fecha,
        c.hora_inicio,
        c.hora_fin,
        c.modalidad,
        i.nombre AS institucion,
        c.enlace_acceso,
        c.estado
    FROM clases c
    JOIN talleres t ON t.id = c.taller_id
    LEFT JOIN instituciones i ON i.id = c.institucion_id
    WHERE c.taller_id = $1
    ORDER BY c.numero_clase ASC
  `;
  const result = await pool.query(query, [taller_id]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_clase_id = async (id) => {
  const query = `
    SELECT
        c.id,
        t.nombre AS taller,
        c.numero_clase,
        c.titulo,
        c.descripcion,
        c.fecha,
        c.hora_inicio,
        c.hora_fin,
        c.modalidad,
        i.nombre AS institucion,
        c.enlace_acceso,
        c.estado
    FROM clases c
    JOIN talleres t ON t.id = c.taller_id
    LEFT JOIN instituciones i ON i.id = c.institucion_id
    WHERE c.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por número dentro del taller---------------------------------------
export const get_clase_por_numero = async (taller_id, numero_clase, id = null) => {
  const query = `
    SELECT
        c.id,
        c.numero_clase,
        c.titulo
    FROM clases c
    WHERE c.taller_id = $1
      AND c.numero_clase = $2
      AND ($3::uuid IS NULL OR c.id != $3)
  `;
  const result = await pool.query(query, [taller_id, numero_clase, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_clase = async (data) => {
  const query = `
    INSERT INTO clases(
        taller_id,
        numero_clase,
        titulo,
        descripcion,
        fecha,
        hora_inicio,
        hora_fin,
        modalidad,
        institucion_id,
        enlace_acceso,
        estado)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const values = [
    data.taller_id,
    data.numero_clase,
    data.titulo,
    data.descripcion ?? null,
    data.fecha,
    data.hora_inicio,
    data.hora_fin,
    data.modalidad,
    data.institucion_id ?? null,
    data.enlace_acceso ?? null,
    data.estado ?? "pendiente",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_clase = async (id, data) => {
  const columnas_permitidas = [
    "taller_id",
    "numero_clase",
    "titulo",
    "descripcion",
    "fecha",
    "hora_inicio",
    "hora_fin",
    "modalidad",
    "institucion_id",
    "enlace_acceso",
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
    UPDATE clases
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Cambiar estado-----------------------------------------
export const cambiar_estado_clase = async (id, estado) => {
  const query = `
    UPDATE clases
    SET estado = $1, actualizado_en = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [estado, id]);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_titulo_clase = async (titulo) => {
  const query = `
    SELECT
        c.id,
        t.nombre AS taller,
        c.numero_clase,
        c.titulo,
        c.descripcion,
        c.fecha,
        c.hora_inicio,
        c.hora_fin,
        c.modalidad,
        i.nombre AS institucion,
        c.enlace_acceso,
        c.estado
    FROM clases c
    JOIN talleres t ON t.id = c.taller_id
    LEFT JOIN instituciones i ON i.id = c.institucion_id
    WHERE unaccent(LOWER(c.titulo)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY c.fecha ASC, c.hora_inicio ASC
  `;
  const result = await pool.query(query, [titulo]);
  return result.rows;
};

export const get_clases_por_estado = async (estado) => {
  const query = `
    SELECT
        c.id,
        t.nombre AS taller,
        c.numero_clase,
        c.titulo,
        c.descripcion,
        c.fecha,
        c.hora_inicio,
        c.hora_fin,
        c.modalidad,
        i.nombre AS institucion,
        c.enlace_acceso,
        c.estado
    FROM clases c
    JOIN talleres t ON t.id = c.taller_id
    LEFT JOIN instituciones i ON i.id = c.institucion_id
    WHERE c.estado::text = $1
    ORDER BY c.fecha ASC, c.hora_inicio ASC
  `;
  const result = await pool.query(query, [estado]);
  return result.rows;
};

//-------------------------------FACILITADORES DE LA CLASE-----------------------------------------
export const get_facilitadores_de_clase = async (clase_id) => {
  const query = `
    SELECT
        u.id AS facilitador_id,
        u.nombre_usuario,
        u.primer_nombre,
        u.primer_apellido,
        u.correo,
        u.telefono,
        cf.asignado_en
    FROM clase_facilitadores cf
    JOIN usuarios u ON u.id = cf.facilitador_id
    WHERE cf.clase_id = $1
    ORDER BY u.primer_apellido ASC, u.primer_nombre ASC
  `;
  const result = await pool.query(query, [clase_id]);
  return result.rows;
};

export const asignar_facilitador_a_clase = async (clase_id, facilitador_id) => {
  const query = `
    INSERT INTO clase_facilitadores(
        clase_id,
        facilitador_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const values = [clase_id, facilitador_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const quitar_facilitador_de_clase = async (clase_id, facilitador_id) => {
  const query = `
    DELETE FROM clase_facilitadores
    WHERE clase_id = $1 AND facilitador_id = $2
    RETURNING *
  `;
  const values = [clase_id, facilitador_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const get_facilitador_en_clase = async (clase_id, facilitador_id) => {
  const query = `
    SELECT id
    FROM clase_facilitadores
    WHERE clase_id = $1 AND facilitador_id = $2
  `;
  const result = await pool.query(query, [clase_id, facilitador_id]);
  return result.rows[0];
};
