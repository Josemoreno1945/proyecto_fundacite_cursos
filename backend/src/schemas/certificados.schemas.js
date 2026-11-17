import { z } from "zod";

const certificado_schemas = z.object({
  inscripcion_id: z
    .string()
    .uuid("El ID de la inscripción debe ser un UUID válido"),

  codigo_verificacion: z
    .string()
    .min(1, "El código de verificación no puede estar vacío")
    .max(50, "El código de verificación no debe exceder los 50 caracteres")
    .optional(),

  porcentaje_asistencia: z
    .number({ invalid_type_error: "El porcentaje de asistencia debe ser un número" })
    .min(0, "El porcentaje no puede ser menor a 0")
    .max(100, "El porcentaje no puede ser mayor a 100")
    .optional()
    .nullable(),

  archivo_url: z
    .string()
    .url("El archivo debe ser una URL válida")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" || val === undefined ? null : val)),
});

export default certificado_schemas;
