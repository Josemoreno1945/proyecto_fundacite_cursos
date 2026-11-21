import crypto from "crypto";
import { errors, throwError } from "../utils/errors.js";

// Mapa en memoria para almacenar las firmas de peticiones recientes
const peticiones_recientes = new Map();

// Tarea periódica de limpieza cada 60 segundos para liberar memoria
setInterval(() => {
  const ahora = Date.now();
  for (const [clave, tiempo_expiracion] of peticiones_recientes.entries()) {
    if (ahora >= tiempo_expiracion) {
      peticiones_recientes.delete(clave);
    }
  }
}, 60000).unref();

/**
 * Genera un hash SHA-256 corto del cuerpo de la petición.
 */
const calcular_hash_cuerpo = (cuerpo) => {
  if (!cuerpo || Object.keys(cuerpo).length === 0) {
    return "sin_cuerpo";
  }
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(cuerpo))
    .digest("hex");
};

/**
 * Middleware para evitar ráfagas y peticiones duplicadas consecutivas.
 * @param {number} ventana_segundos Tiempo de bloqueo para la misma petición (por defecto 2 segundos).
 */
export const evitar_duplicados = (ventana_segundos = 2) => {
  return (req, res, next) => {
    // 1. Identificar al emisor (usuario en sesión o IP remota)
    const identificador_emisor = req.usuarios?.id || req.ip || "desconocido";

    // 2. Obtener método, ruta y hash del contenido
    const metodo_peticion = req.method;
    const ruta_peticion = req.originalUrl || req.baseUrl + req.path;
    const hash_cuerpo = calcular_hash_cuerpo(req.body);

    // 3. Construir la clave única
    const clave_peticion = `${identificador_emisor}:${metodo_peticion}:${ruta_peticion}:${hash_cuerpo}`;
    const ahora = Date.now();
    const tiempo_expiracion_existente = peticiones_recientes.get(clave_peticion);

    // 4. Si la misma petición fue enviada dentro de la ventana de tiempo, lanzar el error estándar
    if (tiempo_expiracion_existente && ahora < tiempo_expiracion_existente) {
      try {
        throwError(errors.peticion_duplicada);
      } catch (error) {
        return next(error);
      }
    }

    // 5. Registrar el momento en que caducará el bloqueo de esta petición
    const nuevo_tiempo_expiracion = ahora + ventana_segundos * 1000;
    peticiones_recientes.set(clave_peticion, nuevo_tiempo_expiracion);

    next();
  };
};