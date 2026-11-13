import { z } from "zod";

const institucion_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(150, "El nombre no debe exceder los 150 caracteres"),

  direccion: z
    .string()
    .max(500, "La dirección no debe exceder los 500 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  parroquia_id: z
    .string()
    .uuid("El ID de la parroquia debe ser un UUID válido"),

  tipo: z
    .enum(["escuela", "liceo", "universidad", "sede_propia", "otro"]),

  estado: z
    .enum(["activo", "inactivo"]),
});

export default institucion_schemas;

