export function throwError(errorObj) {
  const error = new Error(errorObj.message);
  error.status = errorObj.status;
  throw error;
}

export const errors = {

  // Usuarios
  usuario_no_encontrado: {
    status: 404,
    message: "Usuario no encontrado",
  },
  usuario_correo_no_encontrado: {
    status: 404,
    message: "Correo no encontrado",
  },
  usuario_duplicado: {
    status: 409,
    message: "El usuario ya está registrado",
  },
  usuario_correo_duplicado: {
    status: 409,
    message: "El email ya está registrado",
  },
  usuario_protegido:{
    status:403,
    message:"No puedes eliminar este usuario",
  },
  cuenta_inactiva:{
    status:403,
    message:"Tu cuenta se encuentra inactiva. Contacta al administrador",
  },
  

  // Instituciones
  institucion_no_encontrada: {
    status: 404,
    message: "Institución no encontrada",
  },
  institucion_duplicada: {
    status: 409,
    message: "La institución ya está registrada",
  },

  // Menores
  menor_no_encontrado: {
    status: 404,
    message: "Menor no encontrado",
  },
  menor_cedula_duplicada: {
    status: 409,
    message: "Ya existe un menor registrado con esa cédula",
  },

  // Talleres
  taller_no_encontrado: {
    status: 404,
    message: "Taller no encontrado",
  },
  taller_duplicado: {
    status: 409,
    message: "Ya existe un taller con ese nombre",
  },
  taller_sin_cupos: {
    status: 409,
    message: "El taller no tiene cupos disponibles",
  },
  taller_inactivo: {
    status: 403,
    message: "El taller no está disponible para inscripciones",
  },

  // Profesiones
  profesion_no_encontrada: {
    status: 404,
    message: "Profesión no encontrada",
  },
  profesion_duplicada: {
    status: 409,
    message: "La profesión ya está registrada",
  },

  // Geografía
  estado_no_encontrado: {
    status: 404,
    message: "Estado no encontrado",
  },
  estado_duplicado: {
    status: 409,
    message: "El estado ya está registrado",
  },
  municipio_no_encontrado: {
    status: 404,
    message: "Municipio no encontrado",
  },
  municipio_duplicado: {
    status: 409,
    message: "El municipio ya está registrado en ese estado",
  },
  parroquia_no_encontrada: {
    status: 404,
    message: "Parroquia no encontrada",
  },
  parroquia_duplicada: {
    status: 409,
    message: "La parroquia ya está registrada en ese municipio",
  },

  // Roles y permisos
  rol_no_encontrado: {
    status: 404,
    message: "Rol no encontrado",
  },
  rol_duplicado: {
    status: 409,
    message: "El rol ya está registrado",
  },
  permiso_no_encontrado: {
    status: 404,
    message: "Permiso no encontrado",
  },
  permiso_ya_asignado: {
    status: 409,
    message: "El permiso ya está asignado a este rol",
  },
  rol_protegido:{
    status:403,
    message:'No puedes desactivar este rol principal',
  },
  rol_no_selecionable:{
    status:400,
    message:'El rol seleccionado no está permitido para el registro',
  },
  
  permiso_no_asignado:{
    status:404,
    message:'El permiso no estaba asignado a este rol'
  }, 

  // Login
  contrasena_invalida: {
    status: 401,
    message: "Contraseña incorrecta",
  },

  // Errores generales de base de datos / consultas
  error_de_conexion_bdd: {
    status: 503,
    message: "Error de conexión a la Base de Datos",
  },
  error_de_sintaxis_sql: {
    status: 400,
    message: "Error de sintaxis SQL",
  },
  violacion_de_llave_foranea: {
    status: 409,
    message: "Violación de llave foránea",
  },
  violacion_de_no_nulo: {
    status: 400,
    message: "El valor no puede ser nulo",
  },
  incoherencia_de_tipo_de_dato: {
    status: 400,
    message: "Tipo de dato incorrecto en la consulta",
  },
  fila_no_encontrada: {
    status: 404,
    message: "No se encontraron datos para la consulta",
  },

  // Errores de autenticación o token
  no_autorizado: {
    status: 403,
    message: "Acceso exclusivo para administradores",
  },
  sin_token: {
    status: 401,
    message: "No se proporcionó un token",
  },
  token_invalido: {
    status: 403,
    message: "Token inválido",
  },

  // Otros errores comunes
  campos_faltantes: {
    status: 400,
    message: "Campos obligatorios faltantes",
  },
  datos_invalidos: {
    status: 400,
    message: "Identificador inválido",
  },
};

