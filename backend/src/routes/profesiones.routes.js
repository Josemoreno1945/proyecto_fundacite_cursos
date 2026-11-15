import { Router } from "express";
import {
  c_filtrar_nombre_profesion,
  c_get_profesiones,
  c_get_profesion_id,
  c_post_profesion,
  c_put_profesion,
} from "../controllers/profesiones.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_nombre_profesion", verifyToken, c_filtrar_nombre_profesion);

//---------------------------------Consultas (GET)----------------------------

// Accesible para poblar listas desplegables en registro o formularios
router.get("/profesiones", c_get_profesiones);
router.get("/profesiones_id/:id", verifyToken, c_get_profesion_id);

//---------------------------------Acciones Administrativas (POST / PUT)------

router.post("/post_profesiones", verifyToken, isAdmin, c_post_profesion);
router.put("/editar_profesion/:id", verifyToken, isAdmin, c_put_profesion);

export default router;
