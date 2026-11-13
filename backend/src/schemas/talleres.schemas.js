import { z } from "zod";

const taller_schemas = z.object({
  nombre: z
    .string()
    .min(1, "El nombre no puede estar vacío")
    .max(150, "El nombre no debe exceder los 150 caracteres"),

  descripcion: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),

  area: z
    .enum([
      "matematicas", "fisica", "inteligencia_artificial", "robotica",
      "programacion", "electronica", "alfabetizacion_tecnologica",
      "telecomunicaciones", "agroecologia", "ciencias_naturales",
      "diseno_multimedia", "otro",
    ]),

  dirigido_a: z
    .enum(["adultos", "ninos"]),
  

  total_horas: z
    .number({ invalid_type_error: "El total de horas debe ser un número" })
    .int("El total de horas debe ser un número entero")
    .min(0, "El total de horas no puede ser negativo")
    .default(0),

  cupos_totales: z
    .number({ invalid_type_error: "Los cupos totales deben ser un número" })
    .int("Los cupos totales deben ser un número entero")
    .min(1, "Debe haber al menos 1 cupo"),

  estado: z
    .enum(["activo", "inactivo", "en_curso", "culminado", "cancelado"]),
});

export default taller_schemas;
