import { z } from "zod";

const notificacion_schemas = z.object({
  usuario_id: z
    .string()
    .uuid("El ID del usuario debe ser un UUID válido"),

  taller_id: z
    .string()
    .uuid("El ID del taller debe ser un UUID válido"),

  tipo: z
    .enum(["inscripcion_confirmada", "cupos_llenos_admin", "recordatorio_dia_anterior"]),

  mensaje: z
    .string()
    .min(1, "El mensaje no puede estar vacío"),

  canal: z
    .enum(["whatsapp", "correo", "whatsapp_y_correo"]),

  destino: z
    .string()
    .min(1, "El destino no puede estar vacío")
    .max(150, "El destino no debe exceder los 150 caracteres"),

  estado: z
    .enum(["pendiente", "enviado", "fallido"])
    .default("pendiente"),
});

export const notificacion_put_schemas = notificacion_schemas.partial();
export default notificacion_schemas;
