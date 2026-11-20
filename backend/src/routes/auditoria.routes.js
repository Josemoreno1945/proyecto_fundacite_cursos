import { Router } from "express";
import {
  c_filtrar_auditoria_por_modulo,
  c_filtrar_auditoria_por_tabla,
  c_get_auditoria,
  c_get_auditoria_id,
  c_get_auditoria_por_usuario,
  c_post_auditoria,
} from "../controllers/auditoria.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_auditoria_modulo", verifyToken, isAdmin, c_filtrar_auditoria_por_modulo);
router.get("/f_auditoria_tabla", verifyToken, isAdmin, c_filtrar_auditoria_por_tabla);

//---------------------------------Consultas (GET)----------------------------

router.get("/auditoria", verifyToken, isAdmin, c_get_auditoria);
router.get("/auditoria_id/:id", verifyToken, isAdmin, c_get_auditoria_id);
router.get("/auditoria_por_usuario/:usuario_id",verifyToken,isAdmin,c_get_auditoria_por_usuario);

//---------------------------------Acciones (POST)----------------------------

router.post("/post_auditoria", verifyToken, isAdmin, c_post_auditoria);

export default router;
