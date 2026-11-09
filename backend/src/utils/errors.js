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
    status: 409,
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

