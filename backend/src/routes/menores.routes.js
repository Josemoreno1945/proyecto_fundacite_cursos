import { Router } from "express";
import {
  c_filtrar_nombre_menor,
  c_get_menores,
  c_get_menores_activos,
  c_get_menores_inactivos,
  c_get_menores_por_representante,
  c_get_menores_propios,
  c_get_menor_id,
  c_post_menor,
  c_put_menor,
  c_desactivar_menor,
  c_activar_menor,
} from "../controllers/menores.controllers.js";

import { verifyToken } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/is_admin.js";
import { permitir_roles } from "../middlewares/roles.js";

const router = Router();

//---------------------------------Filtros y Búsqueda------------------------------------

router.get("/f_nombre_menor", verifyToken, isAdmin, c_filtrar_nombre_menor);

//---------------------------------Consultas (GET)---------------------------------------

router.get("/menores", verifyToken, isAdmin, c_get_menores);
router.get("/menores_activos", verifyToken, isAdmin, c_get_menores_activos);
router.get("/menores_inactivos", verifyToken, isAdmin, c_get_menores_inactivos);

// Consulta de menores asignados al usuario en sesión (padre o representante institucional)
router.get(
  "/menores_propios",
  verifyToken,
  permitir_roles("superadmin", "administrador", "representante", "representante_institucional"),
  c_get_menores_propios
);

// Consulta administrativa por representante específico
router.get(
  "/menores_por_representante/:representante_id",
  verifyToken,
  isAdmin,
  c_get_menores_por_representante
);

router.get("/menor_id/:id", verifyToken, c_get_menor_id);

//---------------------------------Creación (POST)---------------------------------------

// Pueden registrar tanto administradores como representantes familiares o institucionales
router.post(
  "/post_menor",
  verifyToken,
  permitir_roles("superadmin", "administrador", "representante", "representante_institucional"),
  c_post_menor
);

//---------------------------------Actualización (PUT)-----------------------------------

router.put(
  "/editar_menor/:id",
  verifyToken,
  permitir_roles("superadmin", "administrador", "representante", "representante_institucional"),
  c_put_menor
);

//---------------------------------Estado (Activar / Desactivar)-------------------------

router.put("/desactivar_menor/:id", verifyToken, isAdmin, c_desactivar_menor);
router.put("/activar_menor/:id", verifyToken, isAdmin, c_activar_menor);

export default router;
