import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_certificados = async () => {
  const query = `
    SELECT
        c.codigo_verificacion,
        c.fecha_emision,
        em.nombre_usuario AS emitido_por_usuario,
        c.porcentaje_asistencia,
        c.archivo_url,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula,
        c.creado_en
    FROM certificados c
    JOIN inscripciones i ON i.id = c.inscripcion_id
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios em ON em.id = c.emitido_por
    ORDER BY c.fecha_emision DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_certificado_id = async (id) => {
  const query = `
    SELECT
        c.codigo_verificacion,
        c.fecha_emision,
        em.nombre_usuario AS emitido_por_usuario,
        c.porcentaje_asistencia,
        c.archivo_url,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula,
        c.creado_en
    FROM certificados c
    JOIN inscripciones i ON i.id = c.inscripcion_id
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios em ON em.id = c.emitido_por
    WHERE c.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por código de verificación (Público)---------------------------------------
export const get_certificado_por_codigo = async (codigo_verificacion) => {
  const query = `
    SELECT
        c.codigo_verificacion,
        c.fecha_emision,
        c.porcentaje_asistencia,
        c.archivo_url,
        t.nombre AS taller,
        t.total_horas,
        t.area,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula
    FROM certificados c
    JOIN inscripciones i ON i.id = c.inscripcion_id
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    WHERE c.codigo_verificacion = $1
  `;
  const result = await pool.query(query, [codigo_verificacion]);
  return result.rows[0];
};

//---------------------------------Get por inscripción---------------------------------------
export const get_certificado_por_inscripcion = async (inscripcion_id) => {
  const query = `
    SELECT
        c.inscripcion_id,
        c.codigo_verificacion,
        c.fecha_emision,
        c.porcentaje_asistencia,
        c.archivo_url,
        c.creado_en
    FROM certificados c
    WHERE c.inscripcion_id = $1
  `;
  const result = await pool.query(query, [inscripcion_id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_certificado = async (data) => {
  const query = `
    INSERT INTO certificados(
        inscripcion_id,
        codigo_verificacion,
        emitido_por,
        porcentaje_asistencia,
        archivo_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    data.inscripcion_id,
    data.codigo_verificacion,
    data.emitido_por,
    data.porcentaje_asistencia ?? null,
    data.archivo_url ?? null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_certificado = async (id, data) => {
  const columnas_permitidas = [
    "porcentaje_asistencia",
    "archivo_url",
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

  values.push(id);

  const query = `
    UPDATE certificados
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_codigo_certificado = async (codigo) => {
  const query = `
    SELECT
        c.codigo_verificacion,
        c.fecha_emision,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido
    FROM certificados c
    JOIN inscripciones i ON i.id = c.inscripcion_id
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    WHERE unaccent(LOWER(c.codigo_verificacion)) LIKE unaccent(LOWER('%' || $1 || '%'))
    ORDER BY c.fecha_emision DESC
  `;
  const result = await pool.query(query, [codigo]);
  return result.rows;
};
