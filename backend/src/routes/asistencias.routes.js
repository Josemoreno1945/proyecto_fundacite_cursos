import { Router } from "express";
import {
  c_filtrar_asistencia_por_estado,
  c_get_asistencias_por_clase,
  c_get_asistencias_por_inscripcion,
  c_get_asistencia_id,
  c_get_asistencia_por_clase_e_inscripcion,
  c_post_asistencia,
  c_put_asistencia,
} from "../controllers/asistencias.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { permitir_roles } from "../middlewares/roles.js";

const router = Router();

//---------------------------------Filtros------------------------------------

router.get("/f_asistencia_estado",verifyToken,permitir_roles("superadmin", "administrador", "facilitador"),c_filtrar_asistencia_por_estado);

//---------------------------------GET----------------------------------------

router.get("/asistencias_por_clase/:clase_id",verifyToken,permitir_roles("superadmin", "administrador", "facilitador"),c_get_asistencias_por_clase);

router.get("/asistencias_por_inscripcion/:inscripcion_id",verifyToken,c_get_asistencias_por_inscripcion);

router.get("/asistencia_id/:id", verifyToken, c_get_asistencia_id);

router.get("/asistencia_clase_inscripcion/:clase_id/:inscripcion_id",verifyToken,permitir_roles("superadmin", "administrador", "facilitador"),c_get_asistencia_por_clase_e_inscripcion);

//---------------------------------POST / PUT---------------------------------

router.post("/post_asistencia",verifyToken,permitir_roles("superadmin", "administrador", "facilitador"),c_post_asistencia);

router.put("/editar_asistencia/:id",verifyToken,permitir_roles("superadmin", "administrador", "facilitador"),c_put_asistencia);

export default router;
