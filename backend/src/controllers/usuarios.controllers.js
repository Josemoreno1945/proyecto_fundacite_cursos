import {
  get_u_activo,
  get_u_inactivo,
  get_usuario,
  get_usuario_id,
  get_usuario_por_correo,
  get_usuario_por_nombreusuario,
  get_roles_disponibles,
  post_usuario,
  put_usuario,
  put_contrasena,
  filtro_nombre_usuario,
  filtro_correo,
  filtro_rol,
  desactivar_usuario,
  activar_usuario,
} from "../models/usuarios.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import usuario_schemas from "../schemas/usuarios.schemas.js";
import contrasena_schemas from "../schemas/contrasena.schemas.js";
import login_schemas from "../schemas/login.schemas.js";
import registro_schemas from "../schemas/registro.schemas.js";
import usuario_put_schemas from "../schemas/usuarios_put.schemas.js"
import nodemailer from "nodemailer";

import { errors, throwError } from "../utils/errors.js";
import { send_success, success_messages } from "../utils/success.js";

//---------------------------------Filtro------------------------------------
export const c_filtrar_nombre_usuario = async (req, res, next) => {
  try {
    const { nombre_usuario } = req.query;

    if (!nombre_usuario) {
      throwError(errors.campos_faltantes)
    }

    const rows = await filtro_nombre_usuario(nombre_usuario);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_filtrar_correo = async (req, res, next) => {
  try {
    const {correo} = req.query;
    if (!correo) {
      throwError(errors.campos_faltantes)
    }
    const rows = await filtro_correo(correo);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_filtrar_rol = async (req, res, next) => {
  try {
    const {nombre} = req.query;
    if (!nombre) {
      throwError(errors.campos_faltantes)
    }
    const rows = await filtro_rol(nombre);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

//---------------------------------Get---------------------------------------
export const c_get_usuarios_en_sesion = async (req, res, next) => {
  try {
    const id = req.usuarios.id;
    const rows = await get_usuario_id(id);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_usuarios_id = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_usuario_id(id);
    if (!rows) {
      throwError(errors.usuario_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_usuarios = async (req, res, next) => {
  try {
    const rows = await get_usuario();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_usuarios_inactivos = async (req, res, next) => {
  try {
    const rows = await get_u_inactivo();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const c_get_usuarios_activos = async (req, res, next) => {
  try {
    const rows = await get_u_activo();
    res.json(rows);
  } catch (error) {
    next(error);
  }
};


export const c_get_usuario_ver = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await get_usuario_id(id);
    if (!rows) {
      throwError(errors.usuario_no_encontrado);
    }
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
//--------------------------------------get por email---------------------------
export const c_get_correo = async (req, res, next) => {
  try {
    const correo = req.params.correo
    const rows = await get_usuario_por_correo(correo);
    if (!rows) {
      throwError(errors.usuario_no_encontrado);
    }
  } catch (error) {
    next(error);
  }
};
//--------------------------------------get por usuario---------------------------
export const c_get_usuario_por_nombreusuario = async (req, res, next) => {
  try {
    const nombre_usuario = req.params.nombre_usuario;
    const rows = await get_usuario_por_nombreusuario(nombre_usuario);
    if (!rows) {
      throwError(errors.usuario_no_encontrado);
    }
  } catch (error) {
    next(error);
  }
};

//-------------------------------Post-----------------------------------------
export const c_post_usuario = async (req, res, next) => {
  try {
    const data = req.body;

    const parseU = usuario_schemas.safeParse(data);

    if (!parseU.success) {
      return res.status(400).json({
        errors: parseU.error.issues,
      });
    }

    //-------------------------------------------------------------
    const correo_existe = await get_usuario_por_correo(data.correo);
    if (correo_existe) {
      throwError(errors.usuario_correo_duplicado);
    }
    const nombreusuario_existe = await get_usuario_por_nombreusuario(data.nombre_usuario);
    if (nombreusuario_existe) {
      throwError(errors.usuario_duplicado);
    }
    //--------------------------------------------------------------

     // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasena_hasheada = await bcrypt.hash(parseU.data.contrasena, salt);
    const datos_para_guardar = {
      ...parseU.data,
      contrasena: contrasena_hasheada,
    };
    const row = await post_usuario(datos_para_guardar);
    delete row.contrasena;
    return send_success(res, success_messages.usuario_creado);
  } catch (error) {
    next(error);
  }
};

//--------------------------------Put----------------------------------------
export const c_put_usuarios = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = { ...req.body };

    const parseU = usuario_put_schemas.safeParse(data);

    if (!parseU.success) {
      return res.status(400).json({
        errors: parseU.error.issues,
      });
    }
    //--------------------------------------------------------------
    if (Object.keys(data).length === 0) {
      throwError(errors.campos_faltantes);
    }

    if (data.contrasena !== undefined) {
      delete data.contrasena;
    }
    //--------------------------------------------------------------
    if (data.correo) {
      const correo_existe = await get_usuario_por_correo(data.correo, id);
      if (correo_existe) {
        throwError(errors.usuario_correo_duplicado);
      }
    }
    if (data.nombre_usuario) {
      const nombreusuario_existe = await get_usuario_por_nombreusuario(data.nombre_usuario, id);
      if (nombreusuario_existe) {
        throwError(errors.usuario_duplicado);
      }
    }

    //--------------------------------------------------------------
    const datos_a_actualizar = { ...parseU.data };
    delete datos_a_actualizar.contrasena;
    const rows = await put_usuario(id, datos_a_actualizar);
    if (!rows) {
      throwError(errors.usuario_no_encontrado)
    }
    delete rows.contrasena;
    return send_success(res, success_messages.usuario_actualizado);
  } catch (error) {
    next(error);
  }
};

//-------------------------------Desactivar-----------------------------------------

export const c_desactivar_usuarios = async (req, res, next) => {
  try {
    const id = req.params.id;
    const usuario_a_desactivar = await get_usuario_id(id);

    if (!usuario_a_desactivar) {
      throwError(errors.usuario_no_encontrado)
    }

    if (usuario_a_desactivar?.usuario_protegido) {
      throwError(errors.usuario_protegido)
    }

    await desactivar_usuario(id);
    return send_success(res, success_messages.usuario_desactivado);

  } catch (error) {
    next(error);
  }
};

//-------------------------------ACTIVAR-----------------------------------------
export const c_activar_usuarios = async (req, res, next) => {
  try {
    const id = req.params.id;
    const usuario_a_activar = await get_usuario_id(id);

    if (!usuario_a_activar) {
      throwError(errors.usuario_no_encontrado)
    }

    await activar_usuario(id);
    return send_success(res, success_messages.usuario_activado);

  } catch (error) {
    next(error);
  }
};




//---------------------Login----------------------------------------------------------
export const login = async (req, res, next) => {
  try {
    const data = req.body;

    //VERIFICAR SI EL USUARIO ESTA ACTIVO O NO
    
    // 1. Validar con Zod
    const parseL= login_schemas.safeParse(data);
    if (!parseL.success) {
      return res.status(400).json({
        errors: parseL.error.issues,
      });
    }
    //---------------------------------------------------------------------
    // 2. Buscar al usuario
    const usuario = await get_usuario_por_nombreusuario(data.nombre_usuario);
    if (!usuario) {
      throwError(errors.usuario_no_encontrado);
    }

    // 3. Comparar la contraseña
    const valid = await bcrypt.compare(data.contrasena, usuario.contrasena);
    if (!valid) {
      throwError(errors.contrasena_invalida);
    }

    if (usuario.estado !== 'activo') {
      throwError(errors.cuenta_inactiva)
    }

    // 4. Generar el token
    const token = jwt.sign(
      { id: usuario.id, 
        username: usuario.nombre_usuario, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 5. Responder
    res.json({
      token,
      usuario: {
        id: usuario.id,
        username: usuario.nombre_usuario,
        rol: usuario.rol_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

//---------------------Registro----------------------------------------------------------


export const registro = async (req, res, next) => {
  try {

    const data = req.body;

    // 1. Validar con Zod
    const parseU = registro_schemas.safeParse(data);
    if (!parseU.success) {
      return res.status(400).json({
        errors: parseU.error.issues,
      });
    }

    //-------------------------------------------------------------
    // 2. VALIDAR QUE EL ROL ESTÉ PERMITIDO PARA EL AUTOREGISTRO
    const roles_permitidos = await get_roles_disponibles();
    const rol_valido = roles_permitidos.some((rol) => rol.id === data.rol_id);

    if (!rol_valido) {
      throwError(errors.rol_no_selecionable)
    }




    // 3. Verificar duplicados de correo y nombre de usuario

    const correo_existe = await get_usuario_por_correo(data.correo);
    if (correo_existe) {
      throwError(errors.usuario_correo_duplicado);
    }
    const nombreusuario_existe = await get_usuario_por_nombreusuario(data.nombre_usuario);
    if (nombreusuario_existe) {
      throwError(errors.usuario_duplicado);
    }
    //--------------------------------------------------------------

    // 4. Hashear la contraseña
 
      const salt = await bcrypt.genSalt(10);
      const contrasena_hasheada = await bcrypt.hash(parseU.data.contrasena, salt);

    // 5. Inyectar de forma segura el estado por defecto ("activo")
    const datos_para_guardar = {
      ...parseU.data,
      contrasena: contrasena_hasheada,
      estado: "activo",
    };
    



    const rows = await post_usuario(datos_para_guardar);
    delete rows.contrasena;
    return send_success(res, success_messages.usuario_creado);
  } catch (error) {
    next(error);
  }
};


//-----------------------roles disponibles-------------------------------------------------------------

export const c_get_roles_disponibles = async (req, res, next) => {
  try {
    const roles = await get_roles_disponibles();
    return res.json(roles);
  } catch (error) {
    next(error);
  }
};




//-----------------olvido su contrasena-------------------------------------------------------
export const olvido_contrasena = async (req, res, next) => {
  try {
    const { correo } = req.body;
    
    if (!correo) {
      throwError(errors.campos_faltantes);
    }

    const user = await get_usuario_por_correo(correo);
    if (!user) {
      throwError(errors.usuario_correo_no_encontrado);
    }


    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1h" });

    const frontendUrl = process.env.FRONTEND_URL;
    const resetUrl = `${frontendUrl}#/reset-password?token=${token}`;

    // Configuración de Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Estructura del correo
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: correo,
      subject: "Recuperar contraseña - Fundacite",
      html: `
        <p>Has solicitado recuperar tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña (válido por 1 hora):</p>
        <p><a href="${resetUrl}">Recuperar contraseña</a></p>
        <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
      `,
    };

    // Envío del correo
    await transporter.sendMail(mailOptions);
    return send_success(res, success_messages.correo_recuperacion_enviado);
  } catch (error) {
    next(error);
  }
};


//-----------------cambiar su contrasena-------------------------------------------------------
export const cambiar_contrasena = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    
    if (!password) {
      throwError(errors.campos_faltantes);
    }

    const parseU = contrasena_schemas.safeParse({ contrasena: password });
    if (!parseU.success) {
      return res.status(400).json({
        errors: parseU.error.issues,
      });
    }

    const secret = process.env.JWT_SECRET;
    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      throwError(errors.token_invalido);
    }

    const user_id = payload.id;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    
  
    const result = await put_contrasena(hashed, user_id);

    if (!result) {
      throwError(errors.usuario_no_encontrado);
    }

    return send_success(res, success_messages.contrasena_actualizada);
  } catch (error) {
    next(error);
  }
};