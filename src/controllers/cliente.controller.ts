import { Prisma } from '@prisma/client'
import { Request, Response } from "express"
import { ClienteService } from "../services"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"
import { Constant } from '../config/constants'

export class ClienteController {
  static async obtenerClientes (req: Request, res: Response) {
    const { _page, _limit, _sort, _order} = req.query
    
    const limit = +(_limit ?? Constant.LIMITE_PAGINACION_CLIENTES)
    const offset = (+(_page ?? 1) - 1 ) * limit
    const sort = (_sort ?? "createdAt").toString()
    const order = _order ?? "asc"
    const orderBy = {[sort]: order}
    const page = (+(_page ?? 1))

    try {            
      const totalClientes = await ClienteService.obtenerTotalClientes()
      const clientes = await prisma?.cliente.findMany({
        orderBy,
        skip: offset,
        take: limit        
      })

      const meta = {
        page,
        limit,
        totalResults: clientes?.length,
        total: totalClientes,
        sort,
        order,
        next: `/api/v1/clientes?_page=${(+page + 1)}&_limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/clientes?_page=${(+page-1)}&_limit=${+limit}`: null
      }

      HttpResponseOk(res, clientes, meta)    
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarCliente (req: Request, res: Response) {
    const { nombre } = req.body

    try {            
        const existeCliente = await ClienteService.existeCliente(nombre)

        if (existeCliente) {
          HttpResponseBadRequest(res, Message.CLIENTE_YA_EXISTE)  
          return
        }

        await ClienteService.registrarCliente(nombre)
        HttpResponseCreated(res, nombre, Message.CLIENTE_REGISTRADO)    
    } catch (error: any) {  
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          HttpResponseBadRequest(res, Message.CLIENTE_YA_EXISTE)  
          return
        }

        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async obtenerCliente (req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id)) {
      HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
      return
    }    

    try {
      const cliente = await ClienteService.obtenerCliente(id)
  
      if (!cliente) {
        HttpResponseNotFound(res, Message.CLIENTE_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, cliente, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async actualizarCliente (req: Request, res: Response) {
    let cliente
    const id = +req.params.id
    const { nombre, estado } = req.body
    
    try {
      if (isNaN(id)) {
        HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
        return
      }      

      cliente = await ClienteService.obtenerCliente(id)
      
      if (!cliente) {
        HttpResponseNotFound(res, Message.CLIENTE_NO_ENCONTRADO)
        return
      }
      
      cliente = await ClienteService.existeCliente(nombre)
            
      if (cliente) {
        HttpResponseBadRequest(res, Message.CLIENTE_YA_EXISTE)
        return
      }
  
      cliente = await ClienteService.actualizarCliente(id, nombre, estado)
      HttpResponseOk(res, cliente, null, Message.CLIENTE_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }
}