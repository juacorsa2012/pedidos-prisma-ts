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

  it("debe existir un función llamada obtenerPedido", () => {
    expect(typeof PedidoController.obtenerPedido).toBe("function")
  })

  it("debe existir un función llamada borrarPedido", () => {
    expect(typeof PedidoController.borrarPedido).toBe("function")
  })

  it("debe existir un función llamada actualizarPedido", () => {
    expect(typeof PedidoController.actualizarPedido).toBe("function")
  })

  it("GET - debe devolver todos los pedidos con el estado PEDIDO", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()      
  })
  
  it("GET - debe devolver un pedido", async () => {
    const res = await request(server).get(url + pedido1.id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe("")
    expect(res.body.data.cliente).toBeDefined()
    expect(res.body.data.proveedor).toBeDefined()
    expect(res.body.data.producto).toBeDefined()
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.id).toBeDefined()
  })

  it("GET - debe devolver un error 404 si el pedido no existe", async () => {         
    const id = 999999
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.status).toBe(Constant.ERROR)
    expect(res.body.message).toBe(Message.PEDIDO_NO_ENCONTRADO)   
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

  it("POST - debe devolver un error 400 al registrar un pedido con un cliente no válido", async () => {
    const pedido = { cliente: 0, producto: producto.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.CLIENTE_NO_ENCONTRADO)
  })

  it("POST - debe devolver un error 400 al registrar un pedido con un producto no válido", async () => {
    const pedido = { cliente: cliente.id, producto: 0, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PRODUCTO_NO_ENCONTRADO)
  })

  it("POST - debe devolver un error 400 al registrar un pedido con un proveedor no válido", async () => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: 0, unidades: 1, estado: Constant.ESTADO_PEDIDO }
    const res = await request(server).post(url).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PROVEEDOR_NO_ENCONTRADO)
  })

  it("PUT - debe actualizar un pedido con éxito", async() => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.PEDIDO_ACTUALIZADO)
    expect(res.body.statusCode).toBe(StatusCodes.OK)
  })  

  it("PUT - debe dar un error 400 si actualizamos un pedido con unidades a cero", async() => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, unidades: 0, estado: Constant.ESTADO_ENTREGADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido con unidades inferior a cero", async() => {
    const pedido = { cliente: cliente.id, producto: producto.id, proveedor: proveedor.id, unidades: -1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_UNIDADES_POSITIVO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin cliente", async() => {
    const pedido = { producto: producto.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_CLIENTE_REQUERIDO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin producto", async() => {
    const pedido = { cliente: cliente.id, proveedor: proveedor.id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_PRODUCTO_REQUERIDO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin proveedor", async() => {
    const pedido = { producto: producto.id, cliente: cliente.id, unidades: 1, estado: Constant.ESTADO_PREPARADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_PROVEEDOR_REQUERIDO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido sin estado", async() => {
    const pedido = { producto: producto.id, cliente: cliente.id, unidades: 1, proveedor: proveedor.id }
    const res = await request(server).put(url + pedido1.id).send(pedido)       
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido con un estado no válido", async() => {
    const pedido = { producto: producto.id, cliente: cliente.id, unidades: 1, proveedor: proveedor.id, estado: "nnn" }
    const res = await request(server).put(url + pedido1.id).send(pedido)       
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido con un cliente que no existe", async() => {
    const pedido = { producto: producto.id, cliente: 0, unidades: 1, proveedor: proveedor.id, estado: Constant.ESTADO_FACTURADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)       
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.CLIENTE_NO_ENCONTRADO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido con un producto que no existe", async() => {
    const pedido = { producto: 0, cliente: cliente.id, unidades: 1, proveedor: proveedor.id, estado: Constant.ESTADO_FACTURADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)       
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PRODUCTO_NO_ENCONTRADO)
  })    

  it("PUT - debe dar un error 400 si actualizamos un pedido con un proveedor que no existe", async() => {
    const pedido = { producto: producto.id, cliente: cliente.id, unidades: 1, proveedor: 0, estado: Constant.ESTADO_FACTURADO }
    const res = await request(server).put(url + pedido1.id).send(pedido)       
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PROVEEDOR_NO_ENCONTRADO)
  })    

  it("DELETE - debe borrar un pedido con éxito", async() => {    
    const res = await request(server).delete(url + pedido1.id)
    expect(res.statusCode).toBe(StatusCodes.OK)       
    expect(res.body.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)  
    expect(res.body.message).toBe(Message.PEDIDO_BORRADO)
  })    

  it("DELETE - debe dar un error 400 si borramos un pedido que no existe", async() => {    
    const id = 99999
    const res = await request(server).delete(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)       
    expect(res.body.statusCode).toBe(StatusCodes.NOT_FOUND)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PEDIDO_NO_ENCONTRADO)
  })    
})