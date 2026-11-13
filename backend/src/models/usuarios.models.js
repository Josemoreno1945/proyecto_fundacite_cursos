import { pool } from "../db.js";

//---------------------------------Get---------------------------------------
export const get_u_activo = async () => {
  const query = `
    SELECT
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    LEFT JOIN profesiones p ON p.id = u.profesion_id
    WHERE u.estado='activo'
`;
  const result = await pool.query(query);
  return result.rows;
};

export const get_u_inactivo = async () => {
  const query = `
    SELECT 
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE u.estado='inactivo'
  `;
  const result = await pool.query(query);
  return result.rows;
};

//---------------------------------GetUser---------------------------------------
export const get_usuario = async () => {
  const query = `
    SELECT 
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
`;
  const result = await pool.query(query);
  return result.rows;
};

export const get_usuario_id = async (id) => {
  const query = `
    SELECT 
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado,
        u.usuario_protegido
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE u.id= $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

//---------------------------------Get correo---------------------------------------
export const get_usuario_por_correo = async (correo,id=null) => {
  const query = `
    SELECT 
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE u.correo = $1 AND ($2::uuid IS NULL OR u.id != $2)
  `;
  const result = await pool.query(query, [correo,id]);
  return result.rows[0];
};

//---------------------------------Get nombre_usuario---------------------------------------
export const get_usuario_por_nombreusuario = async (nombre_usuario,id=null) => {
  const query =`
    SELECT
        u.id,
        u.rol_id,
        u.contrasena,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE u.nombre_usuario=$1  AND ($2 IS NULL OR u.id != $2)
`;
  const result = await pool.query(query, [nombre_usuario,id]);
  return result.rows[0];
};

//-------------------------------Post-----------------------------------------

export const post_usuario = async (data) => {
  const query = `
    INSERT INTO usuarios(
    rol_id, 
    profesion_id, 
    nombre_usuario,
    cedula, 
    primer_nombre, 
    primer_apellido, 
    sexo,
    nivel_instruccion,
    correo, 
    telefono,
    contrasena,
    estado)
    VALUES ($1, $2, $3, $4, $5, $6,$7, $8, $9, $10,$11,$12)
    RETURNING * 
    `;

  const values = [
    data.rol_id,
    data.profesion_id,
    data.nombre_usuario,
    data.cedula,
    data.primer_nombre,
    data.primer_apellido,
    data.sexo,
    data.nivel_instruccion,
    data.correo,
    data.telefono,
    data.contrasena,
    data.estado,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};
//--------------------------------Put----------------------------------------

export const put_usuario = async (id, data) => {

    const columnas_permitidas = [
    "rol_id",
    "profesion_id",
    "institucion_id",
    "nombre_usuario",
    "cedula",
    "primer_nombre",
    "primer_apellido",
    "sexo",
    "nivel_instruccion",
    "correo",
    "telefono",
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
    UPDATE usuarios
      SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

//-------------------------------FILTROS----------------------------------------
export const filtro_nombre_usuario = async (nombre_usuario) => {
  const query = `
    SELECT
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE unaccent (LOWER(u.nombre_usuario)) LIKE unaccent(LOWER('%' || $1 || '%')) 
  `;
  const result = await pool.query(query,[nombre_usuario]);
  return result.rows;
};

export const filtro_correo = async (correo) => {
  const query = `
    SELECT
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE unaccent (LOWER(u.correo)) LIKE unaccent(LOWER('%' || $1 || '%')) 
  `;

  const result = await pool.query(query, [correo]);
  return result.rows;
};

export const filtro_rol = async (nombre) => {
  const query = ` 
    SELECT
        u.id,
        u.nombre_usuario,
        u.primer_nombre, 
        u.primer_apellido, 
        u.cedula,
        u.sexo, 
        u.nivel_instruccion, 
        p.nombre AS Profesion,
        u.correo, 
        u.telefono,
        r.nombre AS Rol,
        u.estado
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    JOIN profesiones p ON p.id = u.profesion_id
    WHERE unaccent(LOWER(r.nombre::text)) LIKE unaccent(LOWER('%' || $1 || '%'))
  `;
  const result = await pool.query(query,[nombre]);
  return result.rows;
};

//-------------------------------INACTIVO Y ACTIVO-----------------------------------------

export const desactivar_usuario = async (id) => {
  const query = `
  UPDATE usuarios
  SET estado = 'inactivo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

export const activar_usuario = async (id) => {
  const query = `
  UPDATE usuarios
  SET estado = 'activo'
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};


//-------------------------------Actualizar contrase;a-----------------------------------------

export const put_contrasena = async (hashed, id) => {
  const query = `
        UPDATE usuarios 
        SET contrasena = $1 
        WHERE id = $2 
        RETURNING *
        `;

  const values = [hashed, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};


//-------------------------------roles disponibles-----------------------------------------
export const get_roles_disponibles = async () => {
  const query = `
    SELECT 
      id, 
      nombre
    FROM roles 
    WHERE nombre::text IN ('participante', 'facilitador', 'representante')
    ORDER BY id ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};
