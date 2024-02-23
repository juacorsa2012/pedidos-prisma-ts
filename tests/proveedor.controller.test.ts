import prisma from "../src/config/prisma"
import request from "supertest"
import { StatusCodes } from 'http-status-codes'
import { server } from "../src/server"
import { Constant } from "../src/config/constants"
import { Message } from '../src/config/messages'
import { ProveedorController } from "../src/controllers"

let proveedor1: any
const url = '/api/v1/proveedores/'
const nombreProveedor1 = "Proveedor 1"
const nombreProveedor2 = "Proveedor 2"
const longitudMinimaNombreProveedor = Constant.LONGITUD_MINIMA_NOMBRE_PROVEEDOR
const longitudMaximaNombreProveedor = Constant.LONGITUD_MAXIMA_NOMBRE_PROVEEDOR

describe(`TEST: ${url}`, () => {
  beforeEach(async () => {   
    await prisma.pedido.deleteMany()    
    await prisma.proveedor.deleteMany({})
    proveedor1 = await prisma.proveedor.create({ data: { nombre: nombreProveedor1 } })
    await prisma.proveedor.create({ data: { nombre: nombreProveedor2 } })
  })

  afterAll(async () => {
    prisma.$disconnect()
    server.close()
  })

  it("debe existir un función llamada obtenerProveedores", () => {
    expect(typeof ProveedorController.obtenerProveedores).toBe("function")
  })

  it("debe existir un función llamada obtenerProveedor", () => {
    expect(typeof ProveedorController.obtenerProveedor).toBe("function")
  })

  it("debe existir un función llamada registrarProveedor", () => {
    expect(typeof ProveedorController.registrarProveedor).toBe("function")
  })

  it("debe existir un función llamada actualizarProveedor", () => {
    expect(typeof ProveedorController.actualizarProveedor).toBe("function")
  })

  it("GET - debe devolver todos los proveedores con la paginación por defecto", async () => {
    const res = await request(server).get(url)        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
    expect(res.body.meta.page).toBe(1)
    expect(res.body.meta.limit).toBe(Constant.LIMITE_PAGINACION_PROVEEDORES)
    expect(res.body.meta.totalResults).toBe(2)
    expect(res.body.meta.sort).toBe("createdAt")
    expect(res.body.meta.order).toBe("asc")
    expect(res.body.meta.prev).toBeNull()
    expect(res.body.meta.next).toBeDefined()
  })

  it("GET - debe devolver todos los proveedores ordenados por nombre de forma descendente", async () => {
    const res = await request(server).get("/api/v1/proveedores?_sort=nombre")        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver todos los proveedores ordenados por nombre de forma ascendente", async () => {
    const res = await request(server).get("/api/v1/proveedores?_sort=nombre&_order=desc")        
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe("")
    expect(res.body.data).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.length).toBe(2)
  })

  it("GET - debe devolver un proveedor", async () => {
    const res = await request(server).get(url + proveedor1.id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe("")
    expect(res.body.data.nombre).toBe(proveedor1.nombre)
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.id).toBeDefined()
  })

  it("GET - debe devolver un error 404 si el proveedor no existe", async () => {         
    const id = 9999
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.status).toBe(Constant.ERROR)
    expect(res.body.message).toBe(Message.PROVEEDOR_NO_ENCONTRADO)   
  })  

  it("POST - debe registrar un proveedor correctamente", async () => {    
    const proveedor = { nombre: 'Proveedor' }
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.PROVEEDOR_REGISTRADO)
    expect(res.body.data).toBe(proveedor.nombre)       
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del producto", async () => {
    const proveedor = {  }
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PROVEEDOR_NOMBRE_REQUERIDO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del proveedor es inferior a ${longitudMinimaNombreProveedor} caracteres`, async () => {
    const proveedor = { nombre: "xx" }
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.PROVEEDOR_NOMBRE_CORTO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del proveedor es superior a ${longitudMaximaNombreProveedor} caractares`, async () => {
    const longitudMaxima = Constant.LONGITUD_MAXIMA_NOMBRE_PROVEEDOR
    let proveedor = { nombre: new Array(longitudMaxima+2).join('a') }
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)          
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.PROVEEDOR_NOMBRE_LARGO)
  })

  it("POST - debe devolver un error 400 si el proveedor ya existe en la base de datos", async () => {        
    const proveedor = { nombre: nombreProveedor1 }
    const res = await request(server).post(url).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)             
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST) 
    expect(res.body.message).toBe(Message.PROVEEDOR_YA_EXISTE)    
  })

  it("PUT - debe actualizar un proveedor con éxito", async() => {
    const proveedor = { nombre: "Producto 999" }
    const res = await request(server).put(url + proveedor1.id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)   
    expect(res.body.message).toBe(Message.PROVEEDOR_ACTUALIZADO)
    expect(res.body.statusCode).toBe(StatusCodes.OK)
    expect(res.body.data.id).toBeDefined()
    expect(res.body.data.nombre).toBe(proveedor.nombre)    
  })  

  it("PUT - debe dar un error 400 si actualizamos un proveedor sin nombre", async() => {
    const proveedor = { }
    const res = await request(server).put(url + proveedor1.id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)  
    expect(res.body.message).toBe(Message.PROVEEDOR_NOMBRE_REQUERIDO)
  })    

  it(`PUT - debe dar un error 400 si actualizamos un proveedor con un nombre inferior a ${longitudMinimaNombreProveedor} caracteres`, async() => {
    const proveedor = { nombre: "aa" }
    const res = await request(server).put(url + proveedor1.id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)   
    expect(res.body.status).toBe(Constant.ERROR)      
    expect(res.body.message).toBe(Message.PROVEEDOR_NOMBRE_CORTO)
  })    

  it(`PUT - debe dar un error 400 si actualizamos un proveedor con un nombre superior a ${longitudMaximaNombreProveedor} caracteres`, async() => {
    let proveedor = { nombre: new Array(longitudMaximaNombreProveedor + 2).join('a') }
    const res = await request(server).put(url + proveedor1.id).send(proveedor)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)       
    expect(res.body.status).toBe(Constant.ERROR)      
    expect(res.body.message).toBe(Message.PROVEEDOR_NOMBRE_LARGO)
  })  
})