import prisma from "../src/config/prisma"
import request from "supertest"
import { StatusCodes } from 'http-status-codes'
import { server } from "../src/server"
import { Constant } from "../src/config/constants"
import { Message } from '../src/config/messages'
import { PedidoController } from "../src/controllers"

let pedido1: any
let cliente: any;
let producto: any;
let proveedor: any;
const url = "/api/v1/pedidos/"

describe(`TEST: ${url}`, () => {
  beforeEach(async () => {       
    await prisma.pedido.deleteMany()
    await prisma.cliente.deleteMany()
    await prisma.producto.deleteMany()
    await prisma.proveedor.deleteMany()
    cliente = await prisma.cliente.create({ data: { nombre: "cliente 1" } })
    producto  = await prisma.producto.create({ data: { nombre: "producto 1" } })
    proveedor = await prisma.proveedor.create({ data: { nombre: "proveedor 1" } })

    pedido1 = await prisma.pedido.create({ 
      data: { 
        clienteId: cliente.id,
        productoId: producto.id,
        proveedorId: proveedor.id,
        unidades: 9
      } 
    })    
  })

  afterAll(async () => {
    prisma.$disconnect()
    server.close()
  })

  it("debe existir un función llamada registrarPedido", () => {
    expect(typeof PedidoController.registrarPedido).toBe("function")
  })

  it("POST - debe registrar un pedido correctamente", async () => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)    
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.PEDIDO_REGISTRADO)
    expect(res.body.data.cliente.nombre).toBe(cliente.nombre)
    expect(res.body.data.producto.nombre).toBe(producto.nombre)
    expect(res.body.data.proveedor.nombre).toBe(proveedor.nombre)
    expect(res.body.data.unidades).toBe(pedido.unidades)
    expect(res.body.data.createdAt).toBeDefined()         
    expect(res.body.data.updatedAt).toBeDefined()
    expect(res.body.data.id).toBeDefined()         
    expect(res.body.data.cliente).toBeDefined()
    expect(res.body.data.proveedor).toBeDefined()
    expect(res.body.data.producto).toBeDefined()
  })

  it("POST - debe devolver un error 400 cuando no se facilita el cliente asociado al pedido", async () => {
    const pedido = { producto: producto.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_CLIENTE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el producto asociado al pedido", async () => {
    const pedido = { cliente: cliente.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_PRODUCTO_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el proveedor asociado al pedido", async () => {
    const pedido = { cliente: cliente.id, producto: producto.id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_PROVEEDOR_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilitan las unidades del pedido", async () => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando las unidades del pedido es inferior a cero", async () => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, unidades: -1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })

  it("POST - debe devolver un error 400 cuando las unidades del pedido es cero", async () => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, unidades: 0, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })






})