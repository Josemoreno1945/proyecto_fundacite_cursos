import { z } from "zod";

const horas_regex = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

export const base_clases_schemas = z.object({
  taller_id: z
    .string()
    .uuid("El ID del taller debe ser un UUID válido"),

  numero_clase: z
    .number({ invalid_type_error: "El número de clase debe ser un número" })
    .int("El número de clase debe ser un número entero")
    .min(1, "El número de clase debe ser mayor o igual a 1"),

  titulo: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(200, "El título no debe exceder los 200 caracteres"),

  descripcion: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" || val === undefined ? null : val)),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD")
    .refine((val) => !Number.isNaN(Date.parse(val)), "La fecha no es válida"),

  hora_inicio: z
    .string()
    .regex(horas_regex, "La hora de inicio debe tener el formato HH:MM"),

  hora_fin: z
    .string()
    .regex(horas_regex, "La hora de fin debe tener el formato HH:MM"),

  modalidad: z
    .enum(["presencial", "virtual"]),

  institucion_id: z
    .string()
    .uuid("El ID de la institución debe ser un UUID válido")
    .optional()
    .nullable(),

  enlace_acceso: z
    .string()
    .url("El enlace de acceso debe ser una URL válida")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" || val === undefined ? null : val)),

  estado: z
    .enum(["pendiente", "en_curso", "culminada", "cancelada"])
    .default("pendiente"),
});

export const clases_put_schemas = base_clases_schemas.partial();
const clases_schemas = base_clases_schemas;
export default clases_schemas;
