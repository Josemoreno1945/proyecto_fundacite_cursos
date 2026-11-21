import { Router } from "express";
import {
  c_filtrar_estado_inscripcion,
  c_get_inscripciones,
  c_get_inscripciones_por_taller,
  c_get_inscripciones_por_usuario,
  c_get_inscripciones_por_menor,
  c_get_inscripcion_id,
  c_post_inscripcion,
  c_cambiar_estado_inscripcion,
} from "../controllers/inscripciones.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";
import { evitar_duplicados } from "../middlewares/evitar_duplicados.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_estado_inscripcion", verifyToken, isAdmin, c_filtrar_estado_inscripcion);

//---------------------------------GET----------------------------------------

router.get("/inscripciones", verifyToken, isAdmin, c_get_inscripciones);
router.get("/inscripcion_id/:id", verifyToken, isAdmin, c_get_inscripcion_id);

router.get("/inscripciones_por_taller/:taller_id", verifyToken, isAdmin, c_get_inscripciones_por_taller);
router.get("/inscripciones_por_usuario/:usuario_id", verifyToken, c_get_inscripciones_por_usuario);
router.get("/inscripciones_por_menor/:menor_id", verifyToken, c_get_inscripciones_por_menor);

//---------------------------------POST / PUT---------------------------------

router.post("/post_inscripcion", verifyToken, evitar_duplicados(3), c_post_inscripcion);
router.put("/cambiar_estado_inscripcion/:id", verifyToken, isAdmin, evitar_duplicados(2), c_cambiar_estado_inscripcion);

export default router;

