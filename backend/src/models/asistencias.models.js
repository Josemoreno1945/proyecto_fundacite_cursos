import { pool } from "../db.js";

//---------------------------------Get por clase---------------------------------------
export const get_asistencias_por_clase = async (clase_id) => {
  const query = `
    SELECT
        c.numero_clase,
        c.titulo AS clase_titulo,
        a.asistio,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula,
        reg.primer_nombre AS registrado_por_nombre,
        reg.primer_apellido AS registrado_por_apellido,
        a.registrado_en
    FROM asistencias a
    JOIN clases c ON c.id = a.clase_id
    JOIN inscripciones i ON i.id = a.inscripcion_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios reg ON reg.id = a.registrado_por
    WHERE a.clase_id = $1
    ORDER BY u.primer_apellido ASC, m.primer_apellido ASC
  `;
  const result = await pool.query(query, [clase_id]);
  return result.rows;
};

//---------------------------------Get por inscripción---------------------------------------
export const get_asistencias_por_inscripcion = async (inscripcion_id) => {
  const query = `
    SELECT
        c.numero_clase,
        c.titulo AS clase_titulo,
        c.fecha AS clase_fecha,
        a.asistio,
        a.registrado_en
    FROM asistencias a
    JOIN clases c ON c.id = a.clase_id
    WHERE a.inscripcion_id = $1
    ORDER BY c.numero_clase ASC
  `;
  const result = await pool.query(query, [inscripcion_id]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_asistencia_id = async (id) => {
  const query = `
    SELECT
        a.id,
        a.asistio,
        a.registrado_en
    FROM asistencias a
    WHERE a.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get por clase e inscripción---------------------------------------
export const get_asistencia_por_clase_e_inscripcion = async (clase_id, inscripcion_id) => {
  const query = `
    SELECT
        a.id,
        a.asistio
    FROM asistencias a
    WHERE a.clase_id = $1 AND a.inscripcion_id = $2
  `;
  const result = await pool.query(query, [clase_id, inscripcion_id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_asistencia = async (data) => {
  const query = `
    INSERT INTO asistencias(
        inscripcion_id,
        clase_id,
        asistio,
        registrado_por)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [
    data.inscripcion_id,
    data.clase_id,
    data.asistio,
    data.registrado_por,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_asistencia = async (id, data) => {
  const query = `
    UPDATE asistencias
    SET asistio = $1, registrado_por = $2, registrado_en = NOW()
    WHERE id = $3
    RETURNING *
  `;
  const values = [data.asistio, data.registrado_por, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_asistencia_por_estado = async (clase_id, asistio) => {
  const query = `
    SELECT
        a.asistio,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido
    FROM asistencias a
    JOIN inscripciones i ON i.id = a.inscripcion_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    WHERE a.clase_id = $1 AND a.asistio::text = $2
    ORDER BY u.primer_apellido ASC, m.primer_apellido ASC
  `;
  const result = await pool.query(query, [clase_id, asistio]);
  return result.rows;
};
