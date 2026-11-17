import { base_usuario_schemas } from "./usuarios.schemas.js";

const registro_schemas = base_usuario_schemas
  .omit({ estado: true })
  .refine((data) => data.correo || data.telefono, {
    message: "Debe proporcionar al menos un correo electrónico o un número de teléfono.",
    path: ["correo"],
  });

export default registro_schemas;
