
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  TIPOS (ENUMS)
-- ============================================================

CREATE TYPE "asistencia" AS ENUM (
  'asistio',
  'no_asistio'
);

CREATE TYPE "estado" AS ENUM (
  'activo',
  'inactivo'
);

CREATE TYPE "nombre_rol" AS ENUM (
  'superadmin',
  'administrador',
  'facilitador',
  'participante',
  'representante',                -- Padre/tutor: gestiona sus propios hijos (menores)
  'representante_institucional'   -- Coordinador escolar: gestiona los menores de su institución
);

CREATE TYPE "dirigido_a" AS ENUM (
  'adultos',
  'ninos'
);


CREATE TYPE "estado_taller" AS ENUM (
  'activo',
  'inactivo',
  'en_curso',
  'culminado',
  'cancelado'
);


CREATE TYPE "estado_clase" AS ENUM (
  'pendiente',
  'en_curso',
  'culminada',
  'cancelada'
);


CREATE TYPE "modalidad_clase" AS ENUM (
  'presencial',
  'virtual'
);

CREATE TYPE "estado_inscripcion" AS ENUM (
  'confirmado',
  'cancelado',
  'lista_espera'
);

CREATE TYPE "tipo_notificacion" AS ENUM (
  'inscripcion_confirmada',
  'cupos_llenos_admin',
  'recordatorio_dia_anterior'
);

CREATE TYPE "canal_notificacion" AS ENUM (
  'whatsapp',
  'correo',
  'whatsapp_y_correo'
);

CREATE TYPE "estado_notificacion" AS ENUM (
  'pendiente',
  'enviado',
  'fallido'
);

CREATE TYPE "tipo_recuperacion" AS ENUM (
  'correo',
  'whatsapp'
);

CREATE TYPE "accion_auditoria" AS ENUM (
  'crear',
  'actualizar',
  'eliminar',
  'login',
  'logout',
  'inscribir',
  'cancelar_inscripcion',
  'registrar_asistencia'
);

CREATE TYPE "tipo_institucion" AS ENUM (
  'escuela',
  'liceo',
  'universidad',
  'sede_propia',
  'otro'
);


CREATE TYPE "area_taller" AS ENUM (
  'matematicas',
  'fisica',
  'inteligencia_artificial',
  'robotica',
  'programacion',
  'electronica',
  'alfabetizacion_tecnologica',
  'telecomunicaciones',
  'agroecologia',
  'ciencias_naturales',
  'diseno_multimedia',
  'otro'
);

CREATE TYPE "genero" AS ENUM (
  'femenino',
  'masculino',
  'otro'
);

CREATE TYPE "nivel_instruccion" AS ENUM (
  'primaria',
  'bachiller',
  'tsu',
  'universitario',
  'postgrado',
  'otro'
);

CREATE TYPE "grado_escolar" AS ENUM (
  'Preescolar',
  '1er_Grado',
  '2do_Grado',
  '3er_Grado',
  '4to_Grado',
  '5to_Grado',
  '6to_Grado',
  '1er_Año',
  '2do_Año',
  '3er_Año',
  '4to_Año',
  '5to_Año',
  '6to_Año',
  'No_Escolarizado'
);

-- ============================================================
--  TABLAS
-- ============================================================

CREATE TABLE "roles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" nombre_rol UNIQUE NOT NULL,
  "descripcion" text,
  "estado" estado NOT NULL DEFAULT 'activo'
);

CREATE TABLE "permisos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" varchar(100) UNIQUE NOT NULL,
  "descripcion" text
);

CREATE TABLE "rol_permisos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "rol_id" uuid NOT NULL,
  "permiso_id" uuid NOT NULL
);

CREATE TABLE "profesiones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" varchar(100) UNIQUE NOT NULL,
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

CREATE TABLE "usuarios" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "rol_id" uuid NOT NULL,
  "profesion_id" uuid,
  "institucion_id" uuid,                -- Solo aplica para representante_institucional y facilitador (su sede)
  "nombre_usuario" varchar(50) UNIQUE NOT NULL,
  "cedula" varchar(15) UNIQUE NOT NULL,
  "primer_nombre" varchar(100) NOT NULL,
  "primer_apellido" varchar(100) NOT NULL,
  "sexo" genero NOT NULL,
  "nivel_instruccion" nivel_instruccion NOT NULL,
  "correo" varchar(150) UNIQUE,         -- Opcional: correo o telefono requerido
  "telefono" varchar(20) UNIQUE,        -- Formato internacional: 584121234567
  "contrasena" text NOT NULL,           -- bcrypt
  "estado" estado NOT NULL DEFAULT 'activo',
  "usuario_protegido" boolean NOT NULL DEFAULT false,
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

CREATE TABLE "menores" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "representante_id" uuid NOT NULL,     -- Usuario (padre o coordinador escolar) que registró al menor
  "institucion_id" uuid,                -- Escuela/institución a la que pertenece el menor
  "cedula" varchar(20),
  "primer_nombre" varchar(100) NOT NULL,
  "primer_apellido" varchar(100) NOT NULL,
  "fecha_nacimiento" date NOT NULL,
  "sexo" genero NOT NULL,
  "grado_escolar" grado_escolar NOT NULL,
  "estado" estado NOT NULL DEFAULT 'activo',
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

CREATE TABLE "estados" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" varchar(100) NOT NULL,
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

CREATE TABLE "municipios" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "estado_id" uuid NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

CREATE TABLE "parroquias" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "municipio_id" uuid NOT NULL,
  "nombre" varchar(100) NOT NULL,
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

CREATE TABLE "instituciones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" varchar(150) NOT NULL,
  "direccion" text,
  "parroquia_id" uuid NOT NULL,
  "tipo" tipo_institucion NOT NULL,
  "estado" estado NOT NULL DEFAULT 'activo',
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);


CREATE TABLE "talleres" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nombre" varchar(150) NOT NULL,
  "descripcion" text,
  "area" area_taller NOT NULL DEFAULT 'otro',
  "dirigido_a" dirigido_a NOT NULL,     -- Define el público: adultos o niños
  "total_horas" int NOT NULL DEFAULT 0,
  "cupos_totales" int NOT NULL,
  "cupos_disponibles" int NOT NULL,     -- El backend descuenta 1 por cada inscripción confirmada
  "estado" estado_taller NOT NULL DEFAULT 'activo',
  "creado_por" uuid NOT NULL,
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);



CREATE TABLE "clases" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "taller_id" uuid NOT NULL,
  "numero_clase" int NOT NULL,
  "titulo" varchar(200) NOT NULL,
  "descripcion" text,
  "fecha" date NOT NULL,
  "hora_inicio" time NOT NULL,
  "hora_fin" time NOT NULL,
  "modalidad" modalidad_clase NOT NULL,
  "institucion_id" uuid,                -- Solo si modalidad = presencial
  "enlace_acceso" text,                 -- Solo si modalidad = virtual
  "estado" estado_clase NOT NULL DEFAULT 'pendiente',
  "creado_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp
);

-- ------------------------------------------------------------
--  FACILITADORES POR CLASE
--  Tabla separada para soportar 1 o más facilitadores por clase
--  sin romper la normalización. Si en el futuro son más de 2,
--  no hay que cambiar nada en la estructura.
-- ------------------------------------------------------------
CREATE TABLE "clase_facilitadores" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "clase_id" uuid NOT NULL,
  "facilitador_id" uuid NOT NULL,       -- Usuario con rol facilitador o administrador
  "asignado_en" timestamp NOT NULL DEFAULT (now())
);


CREATE TABLE "inscripciones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "taller_id" uuid NOT NULL,
  "usuario_id" uuid,                    -- Participante adulto (NULL si es menor)
  "menor_id" uuid,                      -- Participante menor  (NULL si es adulto)
  "inscrito_por" uuid NOT NULL,         -- Quien realizó la inscripción
  "estado" estado_inscripcion NOT NULL DEFAULT 'confirmado',
  "inscrito_en" timestamp NOT NULL DEFAULT (now()),
  "actualizado_en" timestamp,
  CONSTRAINT chk_participante CHECK (
    (usuario_id IS NOT NULL AND menor_id IS NULL) OR
    (usuario_id IS NULL AND menor_id IS NOT NULL)
  )
);

-- ------------------------------------------------------------
--  ASISTENCIAS
--  Se registra por clase. El facilitador o administrador
--  marca si cada inscripto asistió o no.
--  El participante puede consultar su historial desde su perfil.
-- ------------------------------------------------------------
CREATE TABLE "asistencias" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "inscripcion_id" uuid NOT NULL,
  "clase_id" uuid NOT NULL,
  "asistio" asistencia NOT NULL,
  "registrado_por" uuid NOT NULL,       -- Facilitador o administrador que tomó lista
  "registrado_en" timestamp NOT NULL DEFAULT (now())
);

-- ------------------------------------------------------------
--  NOTIFICACIONES
-- ------------------------------------------------------------
CREATE TABLE "notificaciones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuario_id" uuid NOT NULL,
  "taller_id" uuid NOT NULL,
  "tipo" tipo_notificacion NOT NULL,
  "mensaje" text NOT NULL,
  "canal" canal_notificacion NOT NULL,
  "destino" varchar(150) NOT NULL,      -- Telefono o correo según el canal
  "estado" estado_notificacion NOT NULL DEFAULT 'pendiente',
  "enviado_en" timestamp
);

-- ------------------------------------------------------------
--  RECUPERACIÓN DE CONTRASEÑA
-- ------------------------------------------------------------
CREATE TABLE "recuperaciones_contrasena" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuario_id" uuid NOT NULL,
  "token" varchar(255) UNIQUE NOT NULL, -- UUID aleatorio o OTP 6 dígitos
  "tipo" tipo_recuperacion NOT NULL,
  "expira_en" timestamp NOT NULL,       -- NOW() + 1 hora
  "usado" boolean NOT NULL DEFAULT false,
  "creado_en" timestamp NOT NULL DEFAULT (now())
);

-- ------------------------------------------------------------
--  AUDITORÍA
-- ------------------------------------------------------------
CREATE TABLE "auditoria" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "usuario_id" uuid,
  "accion" accion_auditoria NOT NULL,
  "modulo" varchar(50) NOT NULL,
  "tabla_afectada" varchar(60) NOT NULL,
  "registro_id" uuid,
  "datos_anteriores" jsonb,
  "datos_nuevos" jsonb,
  "ip" varchar(45),
  "agente_usuario" text,
  "creado_en" timestamp NOT NULL DEFAULT (now())
);

-- ------------------------------------------------------------

CREATE TABLE "certificados" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "inscripcion_id" uuid UNIQUE NOT NULL,
  "codigo_verificacion" varchar(50) UNIQUE NOT NULL,
  "fecha_emision" timestamp NOT NULL DEFAULT (now()),
  "emitido_por" uuid NOT NULL,
  "porcentaje_asistencia" numeric(5,2),
  "archivo_url" text,
  "creado_en" timestamp NOT NULL DEFAULT (now())
);

-- ============================================================
--  ÍNDICES
-- ============================================================

CREATE UNIQUE INDEX "rol_permiso_unico" ON "rol_permisos" ("rol_id", "permiso_id");

-- No puede haber dos clases con el mismo número dentro del mismo taller
CREATE UNIQUE INDEX "uq_clase_numero" ON "clases" ("taller_id", "numero_clase");

-- Un adulto no puede inscribirse dos veces al mismo taller
CREATE UNIQUE INDEX "uq_inscripcion_adulto" ON "inscripciones" ("taller_id", "usuario_id")
  WHERE "menor_id" IS NULL;

-- Un menor no puede inscribirse dos veces al mismo taller
CREATE UNIQUE INDEX "uq_inscripcion_menor" ON "inscripciones" ("taller_id", "menor_id")
  WHERE "menor_id" IS NOT NULL;

-- Un inscripto solo puede tener un registro de asistencia por clase
CREATE UNIQUE INDEX "uq_asistencia_por_clase" ON "asistencias" ("inscripcion_id", "clase_id");

-- Un facilitador no puede asignarse dos veces a la misma clase
CREATE UNIQUE INDEX "uq_clase_facilitador" ON "clase_facilitadores" ("clase_id", "facilitador_id");

-- ============================================================
--  FOREIGN KEYS
-- ============================================================

ALTER TABLE "usuarios" ADD FOREIGN KEY ("rol_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "usuarios" ADD FOREIGN KEY ("profesion_id") REFERENCES "profesiones" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "usuarios" ADD FOREIGN KEY ("institucion_id") REFERENCES "instituciones" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "rol_permisos" ADD FOREIGN KEY ("rol_id") REFERENCES "roles" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "rol_permisos" ADD FOREIGN KEY ("permiso_id") REFERENCES "permisos" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "menores" ADD FOREIGN KEY ("representante_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "menores" ADD FOREIGN KEY ("institucion_id") REFERENCES "instituciones" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "municipios" ADD FOREIGN KEY ("estado_id") REFERENCES "estados" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "parroquias" ADD FOREIGN KEY ("municipio_id") REFERENCES "municipios" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "instituciones" ADD FOREIGN KEY ("parroquia_id") REFERENCES "parroquias" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "talleres" ADD FOREIGN KEY ("creado_por") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "clases" ADD FOREIGN KEY ("taller_id") REFERENCES "talleres" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "clases" ADD FOREIGN KEY ("institucion_id") REFERENCES "instituciones" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "clase_facilitadores" ADD FOREIGN KEY ("clase_id") REFERENCES "clases" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "clase_facilitadores" ADD FOREIGN KEY ("facilitador_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "inscripciones" ADD FOREIGN KEY ("taller_id") REFERENCES "talleres" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "inscripciones" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "inscripciones" ADD FOREIGN KEY ("menor_id") REFERENCES "menores" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "inscripciones" ADD FOREIGN KEY ("inscrito_por") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "asistencias" ADD FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "asistencias" ADD FOREIGN KEY ("clase_id") REFERENCES "clases" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "asistencias" ADD FOREIGN KEY ("registrado_por") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "certificados" ADD FOREIGN KEY ("inscripcion_id") REFERENCES "inscripciones" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "certificados" ADD FOREIGN KEY ("emitido_por") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "notificaciones" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "notificaciones" ADD FOREIGN KEY ("taller_id") REFERENCES "talleres" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "recuperaciones_contrasena" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "auditoria" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id") DEFERRABLE INITIALLY IMMEDIATE;
