import jwt from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { HttpResponseUnthorize } from "../utils/response"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from "../config/constants"
import { UsuarioService } from "../services"

interface JwtPayload {
  id: string
}

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token = ""

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]    
  }
  
  if (!token) {
    HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
    return
  }

  try {
    const payload = jwt.verify(token, <string>process.env.JWT_SECRET) as JwtPayload

    if (!payload) {
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
      return  
    }

    // const usuario = await UsuarioModel.findOne({_id: payload.id}, {password: 0}) 

    const usuario = await UsuarioService.obtenerUsuario(+payload.id)

    if (!usuario) {
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
      return  
    }     
    
    req.body.usuario = usuario   
    next()
  } catch (error: any) {
      logger.error(`${error}`)
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
  }
}

export const isAdmin = (req: Request, res:Response, next: NextFunction) => {
  const { rol } = req.body.usuario  

  if (rol != Constant.ROL_ADMIN) {    
    HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)
    return
  }

  next()
}

export const isRol = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.body.usuario.rol)) {
      HttpResponseUnthorize(res, Message.USUARIO_ACCESO_DENEGADO)      
      return
    }
    next()
  }
}
