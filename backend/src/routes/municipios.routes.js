import { Router } from "express";
import {
  c_filtrar_nombre_municipio,
  c_get_municipios,
  c_get_municipios_por_estado,
  c_get_municipio_id,
  c_post_municipio,
  c_put_municipio,
} from "../controllers/municipios.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_nombre_municipio", verifyToken, c_filtrar_nombre_municipio);

//---------------------------------Consultas (GET)----------------------------

router.get("/municipios", verifyToken, c_get_municipios);
router.get("/municipio_id/:id", verifyToken, c_get_municipio_id);
router.get("/municipio_por_estado/:estado_id", verifyToken, c_get_municipios_por_estado);

//---------------------------------Acciones Administrativas (POST / PUT)------

router.post("/post_municipio", verifyToken, isAdmin, c_post_municipio);
router.put("/editar_municipio/:id", verifyToken, isAdmin, c_put_municipio);

export default router;
