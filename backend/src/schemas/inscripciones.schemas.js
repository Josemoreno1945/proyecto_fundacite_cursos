import { z } from "zod";

export const base_inscripcion_schemas = z.object({
  taller_id: z
    .string()
    .uuid("El ID del taller debe ser un UUID válido"),

  usuario_id: z
    .string()
    .uuid("El ID del usuario debe ser un UUID válido")
    .optional()
    .nullable(),

  menor_id: z
    .string()
    .uuid("El ID del menor debe ser un UUID válido")
    .optional()
    .nullable(),

  estado: z
    .enum(["confirmado", "cancelado", "lista_espera"])
    .default("confirmado"),
});

const inscripcion_schemas = base_inscripcion_schemas.refine(
  (data) => (data.usuario_id && !data.menor_id) || (!data.usuario_id && data.menor_id),
  {
    message: "Debe inscribir a un usuario adulto o a un menor, pero no a ambos ni a ninguno",
    path: ["usuario_id"],
  }
);

export const inscripcion_put_schemas = base_inscripcion_schemas.partial();
export default inscripcion_schemas;
