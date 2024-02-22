import { Prisma } from '@prisma/client'
import { Request, Response } from "express"
import { ProveedorService } from "../services"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from '../config/constants'
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class ProveedorController {
  static async obtenerProveedores (req: Request, res: Response) {
    const { _page, _limit, _sort, _order} = req.query
      
    const limit = +(_limit ?? Constant.LIMITE_PAGINACION_PROVEEDORES)
    const offset = (+(_page ?? 1) - 1 ) * limit
    const sort = (_sort ?? "createdAt").toString()
    const order = _order ?? "asc"
    const orderBy = {[sort]: order}
    const page = (+(_page ?? 1))
  
    try {            
      const totalProveedores = await ProveedorService.obtenerTotalProveedores()
      const proveedores = await prisma?.proveedor.findMany({
        orderBy,
        skip: offset,
        take: limit        
      })
  
      const meta = {
        page,
        limit,
        totalResults: proveedores?.length,
        total: totalProveedores,
        sort,
        order,
        next: `/api/v1/proveedores?_page=${(+page + 1)}&_limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/proveedores?_page=${(+page-1)}&_limit=${+limit}`: null
      }
  
      HttpResponseOk(res, proveedores, meta)    
      } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
      }
    }
  
    static async registrarProveedor (req: Request, res: Response) {
      const { nombre } = req.body
  
      try {            
          const existeProveedor = await ProveedorService.existeProveedor(nombre)
  
          if (existeProveedor) {
            HttpResponseBadRequest(res, Message.PROVEEDOR_YA_EXISTE)  
            return
          }
  
          await ProveedorService.registrarProveedor(nombre)
          HttpResponseCreated(res, nombre, Message.PROVEEDOR_REGISTRADO)    
      } catch (error: any) {  
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            HttpResponseBadRequest(res, Message.PROVEEDOR_YA_EXISTE)  
            return
          }
  
          logger.error(`${error}`)
          HttpResponseError(res, Message.ERROR_GENERAL)
      }
    }

    static async obtenerProveedor (req: Request, res: Response) {
      const id = +req.params.id
  
      if (isNaN(id)) {
        HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
        return
      }    
  
      try {
        const proveedor = await ProveedorService.obtenerProveedor(id)
    
        if (!proveedor) {
          HttpResponseNotFound(res, Message.PROVEEDOR_NO_ENCONTRADO)
          return
        }
    
        HttpResponseOk(res, proveedor, null)   
      } catch (error: any) {
          logger.error(`${error}`)
          HttpResponseError(res, Message.ERROR_GENERAL)
      }
    }

    static async actualizarProveedor (req: Request, res: Response) {
      let proveedor
      const id = +req.params.id
      const { nombre } = req.body
      
      try {
        if (isNaN(id)) {
          HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
          return
        }      
  
        proveedor = await ProveedorService.obtenerProveedor(id)
        
        if (!proveedor) {
          HttpResponseNotFound(res, Message.PROVEEDOR_NO_ENCONTRADO)
          return
        }
        
        proveedor = await ProveedorService.existeProveedor(nombre)
              
        if (proveedor) {
          HttpResponseBadRequest(res, Message.PROVEEDOR_YA_EXISTE)
          return
        }
    
        proveedor = await ProveedorService.actualizarProveedor(id, nombre)
        HttpResponseOk(res, proveedor, null, Message.PROVEEDOR_ACTUALIZADO)
      } catch (error: any) {
          logger.error(`${error}`)
          HttpResponseError(res, Message.ERROR_GENERAL)
      }
    } 
  }