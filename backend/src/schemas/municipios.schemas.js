import { z } from "zod";

const municipio_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no debe exceder los 100 caracteres"),

  estado_id: z
    .string()
    .uuid("El ID del estado debe ser un UUID válido"),
});

export const municipio_put_schemas = municipio_schemas.partial();
export default municipio_schemas;
