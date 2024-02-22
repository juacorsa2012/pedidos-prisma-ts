import { z } from "zod"
import { Message } from "../config/messages"
import { Constant } from "../config/constants"

export const CreateUsuarioSchema = z.object({
  body: z.object({
    nombre: z.string({
      required_error: Message.USUARIO_NOMBRE_REQUERIDO,
      invalid_type_error: Message.USUARIO_NOMBRE_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_NOMBRE_USUARIO, Message.USUARIO_NOMBRE_CORTO)
    .max(Constant.LONGITUD_MAXIMA_NOMBRE_USUARIO, Message.USUARIO_NOMBRE_LARGO),

    password: z.string({
      required_error: Message.USUARIO_PASSWORD_REQUERIDO,
      invalid_type_error: Message.USUARIO_PASSWORD_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_PASSWORD_USUARIO, Message.USUARIO_PASSWORD_CORTO)
    .max(Constant.LONGITUD_MAXIMA_PASSWORD_USUARIO, Message.USUARIO_PASSWORD_LARGO),

    email: z.string({
      required_error: Message.USUARIO_EMAIL_REQUERIDO,
      invalid_type_error: Message.USUARIO_EMAIL_FORMATO_NO_VALIDO
    })
    .email(Message.USUARIO_EMAIL_FORMATO_NO_VALIDO)
  })
})

export const UpdateUsuarioSchema = z.object({
  body: z.object({
    nombre: z.string({
      required_error: Message.USUARIO_NOMBRE_REQUERIDO,
      invalid_type_error: Message.USUARIO_NOMBRE_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_NOMBRE_USUARIO, Message.USUARIO_NOMBRE_CORTO)
    .max(Constant.LONGITUD_MAXIMA_NOMBRE_USUARIO, Message.USUARIO_NOMBRE_LARGO),

    password: z.string({
      required_error: Message.USUARIO_PASSWORD_REQUERIDO,
      invalid_type_error: Message.USUARIO_PASSWORD_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_PASSWORD_USUARIO, Message.USUARIO_PASSWORD_CORTO)
    .max(Constant.LONGITUD_MAXIMA_PASSWORD_USUARIO, Message.USUARIO_PASSWORD_LARGO),

    email: z.string({
      required_error: Message.USUARIO_EMAIL_REQUERIDO,
      invalid_type_error: Message.USUARIO_EMAIL_FORMATO_NO_VALIDO
    })
    .email(Message.USUARIO_EMAIL_FORMATO_NO_VALIDO),

    rol: z.string({
      required_error: Message.USUARIO_ROL_REQUERIDO,
      invalid_type_error: Message.USUARIO_ROL_REQUERIDO
    }) 
  })  
})

export const LoginUsuarioSchema = z.object({
  body: z.object({
    password: z.string({
      required_error: Message.USUARIO_PASSWORD_REQUERIDO,
      invalid_type_error: Message.USUARIO_PASSWORD_CADENA
    })
    .min(Constant.LONGITUD_MINIMA_PASSWORD_USUARIO, Message.USUARIO_PASSWORD_CORTO)
    .max(Constant.LONGITUD_MAXIMA_PASSWORD_USUARIO, Message.USUARIO_PASSWORD_LARGO),

    email: z.string({
      required_error: Message.USUARIO_EMAIL_REQUERIDO     
    })
    .email(Message.USUARIO_EMAIL_FORMATO_NO_VALIDO)
  })
})