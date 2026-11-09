import { Router } from "express";
import {
  c_filtrar_nombre_usuario,
  c_filtrar_correo,
  c_filtrar_rol,
  c_get_usuarios_en_sesion,
  c_get_usuarios_id,
  c_get_usuarios,
  c_get_usuarios_inactivos,
  c_get_usuarios_activos,
  c_get_usuario_ver,
  c_get_correo,
  c_get_usuario_por_nombreusuario,
  c_post_usuario,
  c_put_usuarios,
  c_desactivar_usuarios,
  c_activar_usuarios,
  login,
  registro,
  c_get_roles_disponibles,
  olvido_contrasena,
  cambiar_contrasena
} from "../controllers/usuarios.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//------------------------------------------------------------------------

router.get("/f_nombre_usuario", verifyToken, isAdmin, c_filtrar_nombre_usuario);
router.get("/f_correo", verifyToken, isAdmin, c_filtrar_correo);
router.get("/f_rol", verifyToken, isAdmin, c_filtrar_rol);

router.get("/usuarios", verifyToken, isAdmin, c_get_usuarios);
router.get("/usuarios_activos", verifyToken, isAdmin, c_get_usuarios_activos);
router.get("/usuarios_inactivos", verifyToken, isAdmin, c_get_usuarios_inactivos);
router.get("/usuarios_en_sesion", verifyToken, c_get_usuarios_en_sesion);
router.get("/usuarios_ver/:id", verifyToken, isAdmin,c_get_usuario_ver);


router.get("/usuario_por_nombreusuario/:nombre_usuario",c_get_usuario_por_nombreusuario);
router.get("/usuario_por_correo/:correo",c_get_correo);

router.post("/post_usuario", verifyToken, isAdmin,c_post_usuario);

router.put("/editar_usuario/:id", verifyToken, isAdmin,c_put_usuarios);

router.put("/desactivar_usuario/:id", verifyToken, isAdmin,c_desactivar_usuarios);
router.put("/activar_usuario/:id", verifyToken, isAdmin,c_activar_usuarios);

router.post("/login", login);
router.post("/registro",registro);
router.get("/roles_usuarios",c_get_roles_disponibles)


// ...------------------------------------------------------------------
router.post("/olvido_contrasena",olvido_contrasena);
router.post("/cambiar_contrasena",cambiar_contrasena);


export default router;
