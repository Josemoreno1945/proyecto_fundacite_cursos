import { z } from "zod";
import { contrasena_schemas } from "../schemas/contrasena.schemas.js";

const login_schemas = z.object({
   nombre_usuario: z
    .string()
    .min(1, "El nombre de usuario no puede estar vacío")
    .max(50, "El nombre de usuario no debe exceder los 50 caracteres"),
    
})

.merge(contrasena_schemas)

export default login_schemas;
