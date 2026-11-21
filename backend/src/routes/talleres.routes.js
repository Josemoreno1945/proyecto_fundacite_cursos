import { Router } from "express";
import {
  c_filtrar_nombre_taller,
  c_filtrar_area_taller,
  c_filtrar_dirigido_a,
  c_get_talleres,
  c_get_talleres_por_estado,
  c_get_taller_id,
  c_post_taller,
  c_editar_taller,
  c_cambiar_estado_taller,
} from "../controllers/talleres.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";
import { evitar_duplicados } from "../middlewares/evitar_duplicados.js";

const router = Router();

//---------------------------------Filtros y Búsqueda------------------------------------

router.get("/f_nombre_taller", verifyToken, c_filtrar_nombre_taller);
router.get("/f_area_taller", verifyToken, c_filtrar_area_taller);
router.get("/f_dirigido_a", verifyToken, c_filtrar_dirigido_a);

//---------------------------------Consultas (GET)---------------------------------------

router.get("/talleres", verifyToken, c_get_talleres);
router.get("/talleres_por_estado/:estado", verifyToken, c_get_talleres_por_estado);
router.get("/taller_id/:id", verifyToken, c_get_taller_id);

//---------------------------------Acciones (POST / PUT)---------------------------------

router.post("/post_taller", verifyToken, isAdmin, evitar_duplicados(2), c_post_taller);
router.put("/editar_taller/:id", verifyToken, isAdmin, c_editar_taller);
router.put("/cambiar_estado_taller/:id", verifyToken, isAdmin, evitar_duplicados(2), c_cambiar_estado_taller);

export default router;
