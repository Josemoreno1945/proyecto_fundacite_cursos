import { z } from "zod";

const menor_schemas = z.object({
  representante_id: z
    .string()
    .uuid("El ID del representante debe ser un UUID válido"),

  institucion_id: z
    .string()
    .uuid("El ID de la institución debe ser un UUID válido")
    .optional()
    .nullable(),

  cedula: z
    .string()
    .max(20, "La cédula no debe exceder los 20 caracteres")
    .optional()
    .nullable(),

  primer_nombre: z
    .string()
    .min(1, "El primer nombre no puede estar vacío")
    .max(100, "El primer nombre no debe exceder los 100 caracteres"),

  primer_apellido: z
    .string()
    .min(1, "El primer apellido no puede estar vacío")
    .max(100, "El primer apellido no debe exceder los 100 caracteres"),

  fecha_nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener el formato YYYY-MM-DD"),

  sexo: z
    .enum(["femenino", "masculino", "otro"]),

  grado_escolar: z
    .enum([
      "Preescolar",
      "1er_Grado", "2do_Grado", "3er_Grado", "4to_Grado", "5to_Grado", "6to_Grado",
      "1er_Año", "2do_Año", "3er_Año", "4to_Año", "5to_Año", "6to_Año",
      "No_Escolarizado",
    ]),

  estado: z
    .enum(["activo", "inactivo"]),
    
});

export default menor_schemas;
