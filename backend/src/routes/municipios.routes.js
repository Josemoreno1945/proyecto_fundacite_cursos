import { Router } from "express";
import {
  c_filtrar_nombre_municipio,
  c_get_municipios,
  c_get_municipios_por_estado,
  c_get_municipio_id,
  c_post_municipio,
  c_put_municipio
} from "../controllers/municipios.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//------------------------------------------------------------------------

router.get("/f_nombre_municipio", verifyToken, isAdmin, c_filtrar_nombre_municipio);

router.get("/municipios", verifyToken, isAdmin, c_get_municipios);
router.get("/municipio_id/:id", verifyToken, isAdmin, c_get_municipio_id);
router.get("/municipio_por_estado/:id", verifyToken, isAdmin, c_get_municipios_por_estado);

router.post("/post_municipio", verifyToken, isAdmin,c_post_municipio);
router.put("/editar_municipio/:id", verifyToken, isAdmin,c_put_municipio);


export default router;
