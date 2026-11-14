import { Router } from "express";
import {
  c_filtrar_nombre_parroquia,
  c_get_parroquias,
  c_get_parroquia_id,
  c_get_parroquias_por_municipio,
  c_post_parroquia,
  c_put_parroquia
} from "../controllers/parroquias.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//------------------------------------------------------------------------

router.get("/f_nombre_parroquia", verifyToken, isAdmin, c_filtrar_nombre_parroquia);

router.get("/parroquias", verifyToken, isAdmin, c_get_parroquias);
router.get("/parroquia_id/:id", verifyToken, isAdmin, c_get_parroquia_id);
router.get("/parroquias_por_municipio/:id", verifyToken, isAdmin, c_get_parroquias_por_municipio);

router.post("/post_parroquia", verifyToken, isAdmin,c_post_parroquia);
router.put("/editar_parroquia/:id", verifyToken, isAdmin,c_put_parroquia);


export default router;
