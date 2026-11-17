import { z } from "zod";

const auditoria_schemas = z.object({
  usuario_id: z
    .string()
    .uuid("El ID del usuario debe ser un UUID válido")
    .optional()
    .nullable(),

  accion: z
    .enum([
      "crear",
      "actualizar",
      "eliminar",
      "login",
      "logout",
      "inscribir",
      "cancelar_inscripcion",
      "registrar_asistencia",
    ]),

  modulo: z
    .string()
    .min(1, "El módulo no puede estar vacío")
    .max(50, "El módulo no debe exceder los 50 caracteres"),

  tabla_afectada: z
    .string()
    .min(1, "La tabla afectada no puede estar vacía")
    .max(60, "La tabla afectada no debe exceder los 60 caracteres"),

  registro_id: z
    .string()
    .uuid("El ID del registro debe ser un UUID válido")
    .optional()
    .nullable(),

  datos_anteriores: z
    .any()
    .optional()
    .nullable(),

  datos_nuevos: z
    .any()
    .optional()
    .nullable(),

  ip: z
    .string()
    .max(45, "La IP no debe exceder los 45 caracteres")
    .optional()
    .nullable(),

  agente_usuario: z
    .string()
    .optional()
    .nullable(),
});

export default auditoria_schemas;
