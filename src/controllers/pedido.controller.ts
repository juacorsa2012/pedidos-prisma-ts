import { Request, Response } from "express"
import { PedidoService, ClienteService, ProductoService, ProveedorService } from "../services"
import { Message } from "../config/messages"
import { Constant } from '../config/constants'
import { logger } from "../config/logger"
import { Pedido } from "../services/pedido.service"
import { HttpResponseBadRequest, HttpResponseCreated, HttpResponseError, 
  HttpResponseNotFound, HttpResponseOk } from "../utils/response"

  export class PedidoController {

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

  }
