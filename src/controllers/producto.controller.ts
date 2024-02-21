import { Prisma } from '@prisma/client'
import { Request, Response } from "express"
import { ProductoService } from "../services"
import { Message } from "../config/messages"
import { logger } from "../config/logger"
import { Constant } from '../config/constants'
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"


export class ProductoController {
  static async obtenerProductos (req: Request, res: Response) {
    const { _page, _limit, _sort, _order} = req.query
    
    const limit = +(_limit ?? Constant.LIMITE_PAGINACION_PRODUCTOS)
    const offset = (+(_page ?? 1) - 1 ) * limit
    const sort = (_sort ?? "createdAt").toString()
    const order = _order ?? "asc"
    const orderBy = {[sort]: order}
    const page = (+(_page ?? 1))

    try {            
      const totalProductos = await ProductoService.obtenerTotalProductos()
      const productos = await prisma?.producto.findMany({
        orderBy,
        skip: offset,
        take: limit        
      })

      const meta = {
        page,
        limit,
        totalResults: productos?.length,
        total: totalProductos,
        sort,
        order,
        next: `/api/v1/productos?_page=${(+page + 1)}&_limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/productos?_page=${(+page-1)}&_limit=${+limit}`: null
      }

      HttpResponseOk(res, productos, meta)    
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarProducto (req: Request, res: Response) {
    const { nombre } = req.body

    try {            
        const existeProducto = await ProductoService.existeProducto(nombre)

        if (existeProducto) {
          HttpResponseBadRequest(res, Message.PRODUCTO_YA_EXISTE)  
          return
        }

        await ProductoService.registrarProducto(nombre)
        HttpResponseCreated(res, nombre, Message.PRODUCTO_REGISTRADO)    
    } catch (error: any) {  
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          HttpResponseBadRequest(res, Message.PRODUCTO_YA_EXISTE)  
          return
        }

        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async obtenerProducto (req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id)) {
      HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
      return
    }    

    try {
      const producto = await ProductoService.obtenerProducto(id)
  
      if (!producto) {
        HttpResponseNotFound(res, Message.PRODUCTO_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, producto, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async actualizarProducto (req: Request, res: Response) {
    let producto
    const id = +req.params.id
    const { nombre } = req.body
    
    try {
      if (isNaN(id)) {
        HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
        return
      }      

      producto = await ProductoService.obtenerProducto(id)
      
      if (!producto) {
        HttpResponseNotFound(res, Message.PRODUCTO_NO_ENCONTRADO)
        return
      }
      
      producto = await ProductoService.existeProducto(nombre)
            
      if (producto) {
        HttpResponseBadRequest(res, Message.PRODUCTO_YA_EXISTE)
        return
      }
  
      producto = await ProductoService.actualizarProducto(id, nombre)
      HttpResponseOk(res, producto, null, Message.PRODUCTO_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }
}