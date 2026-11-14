import { Router } from "express";
import {
  c_filtrar_nombre_taller,
  c_filtrar_area_taller,
  c_filtrar_dirigido_a,
  c_get_talleres,
  c_get_talleres_activos,
  c_get_talleres_por_estado,
  c_get_taller_id,
  c_post_taller,
  c_put_taller,
  c_cambiar_estado_taller
} from "../controllers/talleres.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//------------------------------------------------------------------------

router.get("/f_nombre_taller", verifyToken, isAdmin, c_filtrar_nombre_taller);
router.get("/f_area_taller", verifyToken, isAdmin, c_filtrar_area_taller);
router.get("/f_dirigido_a", verifyToken, isAdmin, c_filtrar_dirigido_a);

router.get("/talleres", verifyToken, isAdmin, c_get_talleres);
router.get("/talleres_activos", verifyToken, isAdmin, c_get_talleres_activos);
router.get("/talleres_inactivos", verifyToken, isAdmin, c_get_talleres_inactivos);
router.get("/talleres_por_estado/:id", verifyToken, isAdmin,c_get_talleres_por_estado);
router.get("/taller_id/:id", verifyToken, isAdmin,c_get_taller_id);

router.post("/post_taller", verifyToken, isAdmin,c_post_taller);
router.put("/editar_taller/:id", verifyToken, isAdmin,c_put_taller);

router.put("/cambiar_estado_taller/:estado", verifyToken, isAdmin,c_cambiar_estado_taller);


export default router;
