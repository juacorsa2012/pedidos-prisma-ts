import { Prisma } from '@prisma/client'
import { Request, Response } from "express"
import { ClienteService } from "../services"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class ClienteController {
  static async obtenerClientes (req: Request, res: Response) {
    try {            
      const clientes = await prisma?.cliente.findMany()
      HttpResponseOk(res, clientes, null)    
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
    const id = req.params.id

    try {
      const cliente = await ClienteService.obtenerCliente(Number(id))
  
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
    const id = Number(req.params.id)
    const { nombre, estado } = req.body
    
    try {
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