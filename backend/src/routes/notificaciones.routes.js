import { Router } from "express";
import {
  c_filtrar_notificaciones_por_canal,
  c_get_notificaciones,
  c_get_notificaciones_pendientes,
  c_get_notificaciones_propias,
  c_get_notificaciones_por_usuario,
  c_get_notificacion_id,
  c_post_notificacion,
  c_marcar_notificacion_enviada,
  c_marcar_notificacion_fallida,
} from "../controllers/notificaciones.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_notificaciones_canal", verifyToken, isAdmin, c_filtrar_notificaciones_por_canal);

//---------------------------------GET----------------------------------------

router.get("/notificaciones", verifyToken, isAdmin, c_get_notificaciones);
router.get("/notificaciones_pendientes", verifyToken, isAdmin, c_get_notificaciones_pendientes);
router.get("/notificaciones_propias", verifyToken, c_get_notificaciones_propias);
router.get("/notificaciones_por_usuario/:usuario_id",verifyToken,isAdmin,c_get_notificaciones_por_usuario);
router.get("/notificacion_id/:id", verifyToken, c_get_notificacion_id);

//---------------------------------POST / PUT---------------------------------

router.post("/post_notificacion", verifyToken, isAdmin, c_post_notificacion);
router.put("/notificacion_enviada/:id", verifyToken, isAdmin, c_marcar_notificacion_enviada);
router.put("/notificacion_fallida/:id", verifyToken, isAdmin, c_marcar_notificacion_fallida);

export default router;
