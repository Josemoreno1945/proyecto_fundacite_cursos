export function send_success(res, success_obj, datos = null) {
  const status = success_obj.status;
  const respuesta = {
    message: success_obj.message,
  };
  if (datos !== null && datos !== undefined) {
    respuesta.datos = datos;
  }
  return res.status(status).json(respuesta);
};



export const success_messages = {
  // Usuarios
  usuario_creado: {
    status: 201,
    message: "Usuario registrado con éxito",
  },
  usuario_actualizado: {
    status: 200,
    message: "Usuario actualizado con éxito",
  },
  usuario_activado: {
    status: 200,
    message: "Usuario activado con éxito",
  },
  usuario_desactivado: {
    status: 200,
    message: "Usuario desactivado con éxito",
  },
  contrasena_actualizada: {
    status: 200,
    message: "Contraseña actualizada correctamente",
  },
  correo_recuperacion_enviado: {
    status: 200,
    message: "Correo de recuperación enviado con éxito",
  },
  login_exitoso: {
    status: 200,
    message: "Inicio de sesión exitoso",
  },

  // Instituciones
  institucion_creada: {
    status: 201,
    message: "Institución registrada con éxito",
  },
  institucion_actualizada: {
    status: 200,
    message: "Institución actualizada con éxito",
  },
  institucion_activada: {
    status: 200,
    message: "Institución activada con éxito",
  },
  institucion_desactivada: {
    status: 200,
    message: "Institución desactivada con éxito",
  },

  // Menores
  menor_creado: {
    status: 201,
    message: "Menor registrado con éxito",
  },
  menor_actualizado: {
    status: 200,
    message: "Menor actualizado con éxito",
  },
  menor_activado: {
    status: 200,
    message: "Menor activado con éxito",
  },
  menor_desactivado: {
    status: 200,
    message: "Menor desactivado con éxito",
  },

  // Talleres
  taller_creado: {
    status: 201,
    message: "Taller registrado con éxito",
  },
  taller_actualizado: {
    status: 200,
    message: "Taller actualizado con éxito",
  },
  taller_estado_actualizado: {
    status: 200,
    message: "Estado del taller actualizado con éxito",
  },

  // Profesiones
  profesion_creada: {
    status: 201,
    message: "Profesión registrada con éxito",
  },
  profesion_actualizada: {
    status: 200,
    message: "Profesión actualizada con éxito",
  },
  profesion_eliminada: {
    status: 200,
    message: "Profesión eliminada con éxito",
  },

  // Geografía
  estado_creado: {
    status: 201,
    message: "Estado registrado con éxito",
  },
  estado_actualizado: {
    status: 200,
    message: "Estado actualizado con éxito",
  },
  municipio_creado: {
    status: 201,
    message: "Municipio registrado con éxito",
  },
  municipio_actualizado: {
    status: 200,
    message: "Municipio actualizado con éxito",
  },
  parroquia_creada: {
    status: 201,
    message: "Parroquia registrada con éxito",
  },
  parroquia_actualizada: {
    status: 200,
    message: "Parroquia actualizada con éxito",
  },

  // Roles
  rol_creado: {
    status: 201,
    message: "Rol registrado con éxito",
  },
  rol_actualizado: {
    status: 200,
    message: "Rol actualizado con éxito",
  },
  rol_activado: {
    status: 200,
    message: "Rol activado con éxito",
  },
  rol_desactivado: {
    status: 200,
    message: "Rol desactivado con éxito",
  },
  permiso_asignado: {
    status: 200,
    message: "Permiso asignado al rol con éxito",
  },
  permiso_removido: {
    status: 200,
    message: "Permiso removido del rol con éxito",
  },
};