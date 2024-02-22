import bcrypt  from "bcryptjs"
import { Request, Response } from "express"
import { Usuario, UsuarioService } from "../services"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from '../config/constants'
import { crearToken } from "../utils/createToken"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"


export class UsuarioController {
  static async obtenerUsuarios (req: Request, res: Response) {
    const { _page, _limit, _sort, _order} = req.query
      
    const limit = +(_limit ?? Constant.LIMITE_PAGINACION_USUARIOS)
    const offset = (+(_page ?? 1) - 1 ) * limit
    const sort = (_sort ?? "createdAt").toString()
    const order = _order ?? "asc"
    const orderBy = {[sort]: order}
    const page = (+(_page ?? 1))
  
    try {            
      const totalUsuarios = await UsuarioService.obtenerTotalUsuarios()
      const usuarios = await prisma?.usuario.findMany({
        orderBy,
        skip: offset,
        take: limit        
      })
  
      const meta = {
        page,
        limit,
        totalResults: usuarios?.length,
        total: totalUsuarios,
        sort,
        order,
        next: `/api/v1/usuarios?_page=${(+page + 1)}&_limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/usuarios?_page=${(+page-1)}&_limit=${+limit}`: null
      }
  
      HttpResponseOk(res, usuarios, meta)    
      } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
      }
  }

  static async obtenerUsuario (req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id)) {
      HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
      return
    }    

    try {
      const usuario = await UsuarioService.obtenerUsuario(id)
  
      if (!usuario) {
        HttpResponseNotFound(res, Message.USUARIO_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, usuario, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

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

  static async actualizarUsuario (req: Request, res: Response) {
    try {
      const id = +req.params.id
      const existe = await UsuarioService.obtenerUsuario(id)

      if (!existe) {
        HttpResponseNotFound(res, Message.USUARIO_NO_ENCONTRADO)
        return
      }      
      
      const { email, nombre, password, rol } = req.body
      const salt = await bcrypt.genSalt(Constant.SALT)
      const hashPassword = await bcrypt.hash(password, salt)
      const usuario = { nombre, email, password: hashPassword, rol }      
  
      await UsuarioService.actualizarUsuario(id, usuario)
      HttpResponseOk(res, null, null, Message.USUARIO_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }      
  } 

  static async borrarUsuario (req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id)) {
      HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
      return
    }   
    
    try {
      const usuario = await UsuarioService.obtenerUsuario(id)
  
      if (!usuario) {
        HttpResponseNotFound(res, Message.USUARIO_NO_ENCONTRADO)
        return
      }

      await UsuarioService.borrarUsuario(id)  
      HttpResponseOk(res, null, null, Message.USUARIO_BORRADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }   
  }

  static async loginUsuario (req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const usuario = await UsuarioService.buscarUsuarioPorEmail(email)
            
      if (!usuario) {
        HttpResponseBadRequest(res, Message.USUARIO_CREDENCIALES_INCORRECTAS)      
        return
      }

      const esPasswordOk = await bcrypt.compare(password, usuario.password)

      if (!esPasswordOk) {
        HttpResponseBadRequest(res, Message.USUARIO_CREDENCIALES_INCORRECTAS)      
        return
      }

      const token = crearToken(usuario.id)          

      HttpResponseOk(res, token, "")      
    } catch (error: any) {
      logger.error(`${error}`)
      HttpResponseError(res, Message.ERROR_GENERAL) 
    }
  }
}