import { Router } from "express";
import {
  c_filtrar_nombre_parroquia,
  c_get_parroquias,
  c_get_parroquia_id,
  c_get_parroquias_por_municipio,
  c_post_parroquia,
  c_put_parroquia,
} from "../controllers/parroquias.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_nombre_parroquia", verifyToken, c_filtrar_nombre_parroquia);

//---------------------------------Consultas (GET)----------------------------

router.get("/parroquias", verifyToken, c_get_parroquias);
router.get("/parroquia_id/:id", verifyToken, c_get_parroquia_id);
router.get("/parroquias_por_municipio/:municipio_id", verifyToken, c_get_parroquias_por_municipio);

//---------------------------------Acciones Administrativas (POST / PUT)------

router.post("/post_parroquia", verifyToken, isAdmin, c_post_parroquia);
router.put("/editar_parroquia/:id", verifyToken, isAdmin, c_put_parroquia);

export default router;
