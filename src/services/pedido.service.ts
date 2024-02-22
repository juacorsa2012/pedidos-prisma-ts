import { EstadoPedido } from "@prisma/client";
import prisma from "../config/prisma"

export type Pedido = {
  id?: number;
  clienteId: number;
  productoId: number;
  proveedorId: number;
  modelo: string;
  referencia: string;
  unidades: number;
  parte?: number;
  oferta?: string;
  observaciones?: string;
  estado: string;
}

export class PedidoService {
  static async registrarPedido (pedido: Pedido) {
    return await prisma.pedido.create({ 
      data: {
        clienteId: pedido.clienteId, 
        productoId: pedido.productoId,
        proveedorId: pedido.proveedorId,
        modelo: pedido.modelo,
        referencia: pedido.referencia,
        unidades: pedido.unidades,
        parte: pedido.parte,
        oferta: pedido.oferta,
        observaciones: pedido.observaciones,
        estado: EstadoPedido.PEDIDO
      },
      include: {
        cliente: true,
        producto: true,
        proveedor: true
      }
    })
  }




}
