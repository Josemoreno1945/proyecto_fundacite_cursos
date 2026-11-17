import { z } from "zod";

const parroquia_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no debe exceder los 100 caracteres"),

  municipio_id: z
    .string()
    .uuid("El ID del municipio debe ser un UUID válido"),
});

export const parroquia_put_schemas = parroquia_schemas.partial();
export default parroquia_schemas;
