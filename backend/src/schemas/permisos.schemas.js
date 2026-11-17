import { z } from "zod";

const permiso_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no debe exceder los 100 caracteres"),

  descripcion: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
});

export default permiso_schemas;
