import { Request, Response } from "express"
import { PedidoService, ClienteService, ProductoService, ProveedorService } from "../services"
import { Message } from "../config/messages"
import { Constant } from '../config/constants'
import { logger } from "../config/logger"
import { EstadoPedido } from "@prisma/client"
import { Pedido } from "../services/pedido.service"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, HttpResponseNotFound, HttpResponseOk } from "../utils/response"

export class PedidoController {
  static async obtenerPedidos (req: Request, res: Response) {
    const { _page, _limit, _sort, _order, _estado, _cliente, _producto, _proveedor } = req.query      
    const limit = +(_limit ?? Constant.LIMITE_PAGINACION_PEDIDOS)
    const offset = (+(_page ?? 1) - 1 ) * limit
    const sort = (_sort ?? "createdAt").toString()
    const order = _order ?? "asc"
    const orderBy = {[sort]: order}
    const page = (+(_page ?? 1))
    const estado = _estado as EstadoPedido || Constant.ESTADO_PEDIDO

    let clienteDesde = 0
    let clienteHasta = Constant.MAX_SAFE_INTEGER
    
    if (_cliente) {
      clienteDesde = +_cliente
      clienteHasta = +_cliente
    }     

    let productoDesde = 0
    let productoHasta = Constant.MAX_SAFE_INTEGER
    
    if (_producto) {
      productoDesde = +_producto
      productoHasta = +_producto
    } 
    
    let proveedorDesde = 0
    let proveedorHasta = Constant.MAX_SAFE_INTEGER
    
    if (_proveedor) {
      productoDesde = +_proveedor
      productoHasta = +_proveedor
    } 

    try {            
      const pedidos = await prisma?.pedido.findMany({
        where: {
          estado,
          clienteId: {
            gte: clienteDesde,
            lte: clienteHasta
          },
          productoId: {
            gte: productoDesde,
            lte: productoHasta
          },
          proveedorId: {
            gte: proveedorDesde,
            lte: proveedorHasta
          }
        },
        orderBy,
        skip: offset,
        take: limit,
        include: {
          cliente: true,
          producto: true,
          proveedor: true
        }    
      })
  
      const meta = {
        page,
        limit,
        totalResults: pedidos?.length,
        sort,
        order,
        estado,
        next: `/api/v1/pedidos?_page=${(+page + 1)}&_limit=${+limit}`,
        prev: (+page-1 > 0) ? `/api/v1/pedidos?_page=${(+page-1)}&_limit=${+limit}`: null
      }
  
      HttpResponseOk(res, pedidos, meta)    
      } catch (error: any) {
          logger.error(`${error}`)
          HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async registrarPedido (req: Request, res: Response) {
    const { cliente, producto, proveedor, oferta, parte, modelo, referencia, unidades, observaciones, estado } = req.body
      
    const existeCliente = await ClienteService.obtenerCliente(cliente)

    if (!existeCliente) {
      HttpResponseBadRequest(res, Message.CLIENTE_NO_ENCONTRADO)
      return
    }

    const existeProducto = await ProductoService.obtenerProducto(producto)

    if (!existeProducto) {
      HttpResponseBadRequest(res, Message.PRODUCTO_NO_ENCONTRADO)
      return
    }

    const existeProveedor = await ProveedorService.obtenerProveedor(proveedor)

    if (!existeProveedor) {
      HttpResponseBadRequest(res, Message.PROVEEDOR_NO_ENCONTRADO)
      return
    }
      
    try {
        const pedido: Pedido = { 
          clienteId: cliente, 
          productoId: producto, 
          proveedorId: proveedor, 
          oferta, 
          parte, 
          modelo, 
          referencia, 
          unidades, 
          observaciones,
          estado
        }
        
        const nuevoPedido = await PedidoService.registrarPedido(pedido)
        HttpResponseCreated(res, nuevoPedido, Message.PEDIDO_REGISTRADO)    
      } catch (error: any) {
          logger.error(`${error}`)
          HttpResponseError(res, Message.ERROR_GENERAL)
      }      
   }

  static async obtenerPedido (req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id)) {
      HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
      return
    }    

    try {
      const pedido = await PedidoService.obtenerPedido(id)
  
      if (!pedido) {
        HttpResponseNotFound(res, Message.PEDIDO_NO_ENCONTRADO)
        return
      }
  
      HttpResponseOk(res, pedido, null)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async borrarPedido (req: Request, res: Response) {
    const id = +req.params.id

    if (isNaN(id)) {
      HttpResponseBadRequest(res, Message.ARGUMENTO_NO_VALIDO)
      return
    }    

    try {
      const pedido = await PedidoService.obtenerPedido(id)
  
      if (!pedido) {
        HttpResponseNotFound(res, Message.PEDIDO_NO_ENCONTRADO)
        return
      }
  
      await PedidoService.borrarPedido(id)
      HttpResponseOk(res, null, null, Message.PEDIDO_BORRADO)   
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }
  }

  static async actualizarPedido (req: Request, res: Response) {    
    try {
      const id = +req.params.id
      const { cliente, producto, proveedor, oferta, parte, modelo, referencia, unidades, observaciones, estado } = req.body

      const existe = await PedidoService.obtenerPedido(id)

      if (!existe) {
        HttpResponseNotFound(res, Message.PEDIDO_NO_ENCONTRADO)
        return
      }      
      
      const existeCliente = await ClienteService.obtenerCliente(cliente)

      if (!existeCliente) {
        HttpResponseBadRequest(res, Message.CLIENTE_NO_ENCONTRADO)
        return
      }

      const existeProducto = await ProductoService.obtenerProducto(producto)

      if (!existeProducto) {
        HttpResponseBadRequest(res, Message.PRODUCTO_NO_ENCONTRADO)
        return
      }

      const existeProveedor = await ProveedorService.obtenerProveedor(proveedor)

      if (!existeProveedor) {
        HttpResponseBadRequest(res, Message.PROVEEDOR_NO_ENCONTRADO)
        return
      }

      const pedido: Pedido = { 
        clienteId: cliente, 
        productoId: producto, 
        proveedorId: proveedor, 
        oferta, 
        parte, 
        modelo, 
        referencia, 
        unidades, 
        observaciones,
        estado
      }

      await PedidoService.actualizarPedido(id, pedido)
      HttpResponseOk(res, null, null, Message.PEDIDO_ACTUALIZADO)
    } catch (error: any) {
        logger.error(`${error}`)
        HttpResponseError(res, Message.ERROR_GENERAL)
    }      
  }
}
