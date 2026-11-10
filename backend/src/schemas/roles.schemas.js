import { z } from "zod";

const roles_schemas = z.object({
  nombre: z
    .enum['superadmin','administrador','facilitador','participante','representante','representante_institucional'],
  descripcion: z
    .string()
    .max(255, "La descripción no debe exceder los 255 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  estado: z
    .enum(["activo", "inactivo"], {
      errorMap: () => ({ message: "El estado debe ser 'activo' o 'inactivo'" }),
    })
    .default("activo"),
});

export default roles_schemas;

