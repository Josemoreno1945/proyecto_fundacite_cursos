import { z } from "zod";

const estado_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no debe exceder los 100 caracteres"),
});

export const estado_put_schemas = estado_schemas.partial();
export default estado_schemas;
