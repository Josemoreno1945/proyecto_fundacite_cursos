import { z } from "zod";

const asistencia_schemas = z.object({
  inscripcion_id: z
    .string()
    .uuid("El ID de la inscripción debe ser un UUID válido"),

  clase_id: z
    .string()
    .uuid("El ID de la clase debe ser un UUID válido"),

  asistio: z
    .enum(["asistio", "no_asistio"]),
});

export const asistencia_put_schemas = asistencia_schemas.partial();
export default asistencia_schemas;
