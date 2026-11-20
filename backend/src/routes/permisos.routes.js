import { Router } from "express";
import {
  c_get_permisos,
  c_get_permiso_id,
  c_post_permiso
} from "../controllers/permisos.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------GET----------------------------------------

router.get("/permisos", verifyToken, isAdmin, c_get_permisos);
router.get("/permiso_id/:id", verifyToken, isAdmin, c_get_permiso_id);


//---------------------------------POST---------------------------------------

router.post("/post_permiso", verifyToken, isAdmin, c_post_permiso);

export default router;

