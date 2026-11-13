import { base_usuario_schemas } from "../schemas/usuarios.schemas.js";

const usuario_put_schemas = base_usuario_schemas.partial().refine((data) => {
  if (data.correo === undefined && data.telefono === undefined) return true;
  return data.correo !== null || data.telefono !== null;
}, {
  message: "Debe proporcionar al menos un correo electrónico o un número de teléfono.",
  path: ["correo"],
});

export default usuario_put_schemas;