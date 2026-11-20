import { Router } from "express";
import {
  c_filtrar_titulo_clase,
  c_get_clases,
  c_get_clases_por_taller,
  c_get_clases_por_estado,
  c_get_clase_id,
  c_get_facilitadores_de_clase,
  c_get_facilitador_en_clase,
  c_asignar_facilitador_a_clase,
  c_quitar_facilitador_a_clase,
  c_post_clases,
  c_put_clases,
  c_cambiar_estado_clase
} from "../controllers/clases.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();


//---------------------------------Filtros------------------------------------

router.get("/f_titulo_clase", verifyToken, c_filtrar_titulo_clase);

//---------------------------------GET----------------------------------------

router.get("/clases", verifyToken,isAdmin, c_get_clases);
router.get("/clases_id/:id", verifyToken,isAdmin, c_get_clase_id);

router.get("/clases_por_taller/:taller_id",verifyToken,isAdmin,c_get_clases_por_taller);
router.get("/clases_por_estado/:estado",verifyToken,isAdmin,c_get_clases_por_estado);

router.get("/facilitadores_de_clase/:clase_id",verifyToken,isAdmin,c_get_facilitadores_de_clase);
router.get("/facilitador_en_clase/:clase_id/:facilitador_id",verifyToken,isAdmin,c_get_facilitador_en_clase);

//----------------------------------------------------------------------------

router.post("/asignar_facilitador/:clase_id/:facilitador_id",verifyToken,isAdmin,c_asignar_facilitador_a_clase);
router.delete("/quitar_facilitador/:clase_id/:facilitador_id", verifyToken, isAdmin, c_quitar_facilitador_a_clase);

//---------------------------------POST / PUT---------------------------------

router.post("/post_clases", verifyToken, isAdmin, c_post_clases);
router.put("/editar_clase/:id", verifyToken, isAdmin, c_put_clases);

router.put("/cambiar_estado_clase/:id",verifyToken,isAdmin,c_cambiar_estado_clase)

export default router;
