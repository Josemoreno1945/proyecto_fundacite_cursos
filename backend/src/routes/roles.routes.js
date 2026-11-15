import { Router } from "express";
import {
  c_filtrar_nombre_rol,
  c_get_roles,
  c_get_roles_activos,
  c_get_roles_inactivos,
  c_get_rol_id,
  c_get_rol_por_nombre,
  c_post_rol,
  c_put_rol,
  c_desactivar_rol,
  c_activar_rol,
  c_get_permisos_de_rol,
  c_asignar_permiso_a_rol,
  c_quitar_permiso_de_rol,
} from "../controllers/roles.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_nombre_rol", verifyToken, isAdmin, c_filtrar_nombre_rol);

//---------------------------------Consultas (GET)----------------------------

router.get("/roles", verifyToken, isAdmin, c_get_roles);
router.get("/roles_activos", verifyToken, isAdmin, c_get_roles_activos);
router.get("/roles_inactivos", verifyToken, isAdmin, c_get_roles_inactivos);
router.get("/roles_id/:id", verifyToken, isAdmin, c_get_rol_id);
router.get("/roles_nombre/:nombre", verifyToken, isAdmin, c_get_rol_por_nombre);

//---------------------------------Acciones CRUD------------------------------

router.post("/post_rol", verifyToken, isAdmin, c_post_rol);
router.put("/editar_rol/:id", verifyToken, isAdmin, c_put_rol);

router.put("/desactivar_rol/:id", verifyToken, isAdmin, c_desactivar_rol);
router.put("/activar_rol/:id", verifyToken, isAdmin, c_activar_rol);

//---------------------------------Permisos de Roles--------------------------

router.get("/permisos_roles/:id", verifyToken, isAdmin, c_get_permisos_de_rol);
router.post("/asignar_permiso_a_rol/:id", verifyToken, isAdmin, c_asignar_permiso_a_rol);
router.delete("/quitar_permiso_de_rol/:id/:permiso_id", verifyToken, isAdmin, c_quitar_permiso_de_rol);

export default router;
