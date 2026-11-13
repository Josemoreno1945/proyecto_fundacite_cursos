import { z } from "zod";
import { contrasena_schemas } from "../schemas/contrasena.schemas.js";

export const base_usuario_schemas = z.object({
  rol_id: z.string().uuid("El ID del rol debe ser un UUID válido"),

  profesion_id: z.string().uuid("El ID de la profesión debe ser un UUID válido"),

  nombre_usuario: z
    .string()
    .min(1, "El nombre de usuario no puede estar vacío")
    .max(50, "El nombre de usuario no debe exceder los 50 caracteres"),

  primer_nombre: z
    .string()
    .min(1, "El primer nombre no puede estar vacío")
    .max(100, "El primer nombre no debe exceder los 100 caracteres"),

  primer_apellido: z
    .string()
    .min(1, "El primer apellido no puede estar vacio")
    .max(100, "El primer apellido no debe superar los 100 caracteres"),

  cedula: z
    .string()
    .min(1, "La cédula no puede estar vacía")
    .max(15, "La cédula no debe exceder los 15 caracteres")
    .regex(/^[0-9]+$/, "La cédula debe contener solo números"),

  sexo: z.enum(["femenino", "masculino", "otro"]),

  nivel_instruccion: z.enum(["primaria", "bachiller", "tsu", "universitario", "postgrado", "otro"]),

  estado: z.enum(["activo", "inactivo"]),

  correo: z
    .string()
    .email("Debe ser un correo electrónico válido")
    .max(150, "El correo no debe exceder los 150 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
    
  telefono: z
    .string()
    .max(20, "El teléfono no debe exceder los 20 caracteres")
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
}).merge(contrasena_schemas);

const usuario_schemas = base_usuario_schemas.refine((data) => data.correo || data.telefono, {
  message: "Debe proporcionar al menos un correo electrónico o un número de teléfono.",
  path: ["correo"],
});

export default usuario_schemas;