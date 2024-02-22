import bcrypt  from "bcryptjs"
import { Request, Response } from "express"
import { Usuario, UsuarioService } from "../services"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from '../config/constants'
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"
import { crearToken } from "../utils/createToken"


export class UsuarioController {
  static async registrarUsuario (req: Request, res: Response) {
    try {            
      const { nombre, password, email, rol } = req.body

      const existeUsuario = await UsuarioService.buscarUsuarioPorEmail(email) 
      
      if (existeUsuario) {
        HttpResponseBadRequest(res, Message.USUARIO_YA_EXISTE)      
        return
      }
      
      const salt = await bcrypt.genSalt(Constant.SALT)
      const hashPassword = await bcrypt.hash(password, salt)     
      const usuario: Usuario = { nombre, password: hashPassword, email: email.toLowerCase().trim(), rol }

      const { id } = await UsuarioService.registrarUsuario(usuario)
      const token = crearToken(id) 

      HttpResponseCreated(res, token, Message.USUARIO_REGISTRADO)    
    } catch (error: any) {  
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }


}