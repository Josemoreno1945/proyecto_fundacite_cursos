import { Router } from "express";
import {
  c_filtrar_nombre_institucion,
  c_filtrar_tipo_institucion,
  c_get_instituciones,
  c_get_instituciones_activas,
  c_get_instituciones_inactivas,
  c_get_institucion_id,
  c_post_institucion,
  c_put_institucion,
  c_desactivar_institucion,
  c_activar_institucion,
} from "../controllers/instituciones.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros y Búsqueda------------------------------------

router.get("/f_nombre_institucion", verifyToken, c_filtrar_nombre_institucion);
router.get("/f_tipo_institucion", verifyToken, c_filtrar_tipo_institucion);

//---------------------------------Consultas (GET)---------------------------------------

// Listados administrativos
router.get("/instituciones", verifyToken, isAdmin, c_get_instituciones);
router.get("/instituciones_inactivas", verifyToken, isAdmin, c_get_instituciones_inactivas);

// Consulta de instituciones activas y por ID (accesible para representantes institucionales y usuarios autenticados)
router.get("/instituciones_activas", verifyToken, c_get_instituciones_activas);
router.get("/institucion_id/:id", verifyToken, c_get_institucion_id);

//---------------------------------Acciones Administrativas (POST / PUT)-----------------

router.post("/post_institucion", verifyToken, isAdmin, c_post_institucion);
router.put("/editar_institucion/:id", verifyToken, isAdmin, c_put_institucion);

router.put("/desactivar_institucion/:id", verifyToken, isAdmin, c_desactivar_institucion);
router.put("/activar_institucion/:id", verifyToken, isAdmin, c_activar_institucion);

export default router;
