import { z } from "zod";

const profesion_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no debe exceder los 100 caracteres"),
});

export default profesion_schemas;

