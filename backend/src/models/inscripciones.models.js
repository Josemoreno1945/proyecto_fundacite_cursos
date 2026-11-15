import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_inscripciones = async () => {
  const query = `
    SELECT
        i.id,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula,
        resp.primer_nombre AS inscrito_por_nombre,
        resp.primer_apellido AS inscrito_por_apellido,
        i.estado,
        i.inscrito_en
    FROM inscripciones i
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios resp ON resp.id = i.inscrito_por
    ORDER BY i.inscrito_en DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------Get por taller---------------------------------------
export const get_inscripciones_por_taller = async (taller_id) => {
  const query = `
    SELECT
        i.id,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula,
        resp.primer_nombre AS inscrito_por_nombre,
        resp.primer_apellido AS inscrito_por_apellido,
        i.estado,
        i.inscrito_en
    FROM inscripciones i
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios resp ON resp.id = i.inscrito_por
    WHERE i.taller_id = $1
    ORDER BY i.inscrito_en ASC
  `;
  const result = await pool.query(query, [taller_id]);
  return result.rows;
};

//---------------------------------Get por usuario adulto---------------------------------------
export const get_inscripciones_por_usuario = async (usuario_id) => {
  const query = `
    SELECT
        i.id,
        t.nombre AS taller,
        t.area,
        t.dirigido_a,
        t.estado AS estado_taller,
        i.estado,
        i.inscrito_en
    FROM inscripciones i
    JOIN talleres t ON t.id = i.taller_id
    WHERE i.usuario_id = $1
    ORDER BY i.inscrito_en DESC
  `;
  const result = await pool.query(query, [usuario_id]);
  return result.rows;
};

//---------------------------------Get por menor---------------------------------------
export const get_inscripciones_por_menor = async (menor_id) => {
  const query = `
    SELECT
        i.id,
        t.nombre AS taller,
        t.area,
        t.dirigido_a,
        t.estado AS estado_taller,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        i.estado,
        i.inscrito_en
    FROM inscripciones i
    JOIN talleres t ON t.id = i.taller_id
    JOIN menores m ON m.id = i.menor_id
    WHERE i.menor_id = $1
    ORDER BY i.inscrito_en DESC
  `;
  const result = await pool.query(query, [menor_id]);
  return result.rows;
};

//---------------------------------Get por ID---------------------------------------
export const get_inscripcion_id = async (id) => {
  const query = `
    SELECT
        i.id,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        m.cedula AS menor_cedula,
        resp.primer_nombre AS inscrito_por_nombre,
        resp.primer_apellido AS inscrito_por_apellido,
        i.estado,
        i.inscrito_en
    FROM inscripciones i
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios resp ON resp.id = i.inscrito_por
    WHERE i.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Verificar duplicados---------------------------------------
export const verificar_inscripcion_adulto = async (taller_id, usuario_id, id = null) => {
  const query = `
    SELECT id, estado
    FROM inscripciones
    WHERE taller_id = $1
      AND usuario_id = $2
      AND ($3::uuid IS NULL OR id != $3)
  `;
  const result = await pool.query(query, [taller_id, usuario_id, id]);
  return result.rows[0];
};

export const verificar_inscripcion_menor = async (taller_id, menor_id, id = null) => {
  const query = `
    SELECT id, estado
    FROM inscripciones
    WHERE taller_id = $1
      AND menor_id = $2
      AND ($3::uuid IS NULL OR id != $3)
  `;
  const result = await pool.query(query, [taller_id, menor_id, id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------
export const post_inscripcion = async (data) => {
  const query = `
    INSERT INTO inscripciones(
        taller_id,
        usuario_id,
        menor_id,
        inscrito_por,
        estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    data.taller_id,
    data.usuario_id ?? null,
    data.menor_id ?? null,
    data.inscrito_por,
    data.estado ?? "confirmado",
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

//--------------------------------Put----------------------------------------
export const put_inscripcion = async (id, data) => {
  const columnas_permitidas = [
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
    UPDATE inscripciones
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------Cambiar estado-----------------------------------------
export const cambiar_estado_inscripcion = async (id, estado) => {
  const query = `
    UPDATE inscripciones
    SET estado = $1, actualizado_en = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [estado, id]);
  return result.rows[0];
};

//-------------------------------Filtros-----------------------------------------
export const filtro_estado_inscripcion = async (estado) => {
  const query = `
    SELECT
        i.id,
        t.nombre AS taller,
        u.primer_nombre AS usuario_nombre,
        u.primer_apellido AS usuario_apellido,
        u.cedula AS usuario_cedula,
        m.primer_nombre AS menor_nombre,
        m.primer_apellido AS menor_apellido,
        resp.primer_nombre AS inscrito_por_nombre,
        resp.primer_apellido AS inscrito_por_apellido,
        i.estado,
        i.inscrito_en
    FROM inscripciones i
    JOIN talleres t ON t.id = i.taller_id
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    LEFT JOIN menores m ON m.id = i.menor_id
    JOIN usuarios resp ON resp.id = i.inscrito_por
    WHERE i.estado::text = $1
    ORDER BY i.inscrito_en DESC
  `;
  const result = await pool.query(query, [estado]);
  return result.rows;
};
