export const permitir_roles = (...roles_permitidos) => {
  return (req, res, next) => {
    if (!req.usuarios) {
      return res.status(401).json({ error: "No autorizado: sesión requerida" });
    }

    if (!roles_permitidos.includes(req.usuarios.rol)) {
      return res.status(403).json({
        error: `Acceso denegado: tu rol (${req.usuarios.rol}) no tiene permisos para esta acción`,
      });
    }

    next();
  };
};
