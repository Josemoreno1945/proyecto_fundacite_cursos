import { Router } from "express";
import {
  c_filtrar_nombre_estado,
  c_get_estados,
  c_get_estado_id,
  c_post_estado,
  c_put_estado,
} from "../controllers/estados.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_nombre_estado", verifyToken, c_filtrar_nombre_estado);

//---------------------------------Consultas (GET)----------------------------

router.get("/estados", verifyToken, c_get_estados);
router.get("/estado_id/:id", verifyToken, c_get_estado_id);

//---------------------------------Acciones Administrativas (POST / PUT)------

router.post("/post_estado", verifyToken, isAdmin, c_post_estado);
router.put("/editar_estado/:id", verifyToken, isAdmin, c_put_estado);

export default router;
