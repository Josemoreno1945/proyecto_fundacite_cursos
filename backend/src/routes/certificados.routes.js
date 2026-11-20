import { Router } from "express";
import {
  c_filtrar_codigo_certificado,
  c_get_certificados,
  c_get_certificado_id,
  c_get_certificado_por_codigo,
  c_get_certificado_por_inscripcion,
  c_post_certificado,
  c_cambiar_estado_certificado,
} from "../controllers/certificados.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_codigo_certificado", verifyToken, isAdmin, c_filtrar_codigo_certificado);

//---------------------------------GET----------------------------------------

router.get("/certificados", verifyToken, isAdmin, c_get_certificados);
router.get("/certificado_id/:id", verifyToken, c_get_certificado_id);

// Verificación pública de certificados (accesible sin token para validación por código / QR)
router.get("/certificado_verificar/:codigo_verificacion", c_get_certificado_por_codigo);

router.get("/certificado_inscripcion/:inscripcion_id", verifyToken, c_get_certificado_por_inscripcion);

//---------------------------------POST / PUT---------------------------------

router.post("/post_certificado", verifyToken, isAdmin, c_post_certificado);
router.put("/cambiar_estado_certificado/:id", verifyToken, isAdmin, c_cambiar_estado_certificado);

export default router;
