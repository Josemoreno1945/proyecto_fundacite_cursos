import { Router } from "express";
import {
  c_filtrar_nombre_estado,
  c_get_estado,
  c_get_estado_id,
  c_post_estado,
  c_put_estado
} from "../controllers/estados.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//------------------------------------------------------------------------

router.get("/f_nombre_estado", verifyToken, isAdmin, c_filtrar_nombre_estado);

router.get("/estados", verifyToken, isAdmin, c_get_estado);
router.get("/estado_id/:id", verifyToken, isAdmin, c_get_estado_id);

router.post("/post_estado", verifyToken, isAdmin,c_post_estado);
router.put("/editar_estado/:id", verifyToken, isAdmin,c_put_estado);


export default router;
