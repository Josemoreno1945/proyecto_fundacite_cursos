export const isAdmin = (req, res, next) => {
  if (
    req.usuarios &&
    (req.usuarios.rol === "superadmin" || req.usuarios.rol === "administrador" || req.usuarios.rol === "facilitador")
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Acceso denegado: solo administradores" });
};