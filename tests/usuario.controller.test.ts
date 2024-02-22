import prisma from "../src/config/prisma"
import request from "supertest"
import { StatusCodes } from 'http-status-codes'
import { server } from "../src/server"
import { Constant } from "../src/config/constants"
import { Message } from '../src/config/messages'
import { UsuarioController } from "../src/controllers"

let usuario1: any
let usuario2: any
const url = '/api/v1/usuarios/'
const nombreUsuario1 = "Usuario 1"
const nombreUsuario2 = "Usuario 2"
const longitudMinimaNombreUsuario = Constant.LONGITUD_MINIMA_NOMBRE_USUARIO
const longitudMaximaNombreUsuario = Constant.LONGITUD_MAXIMA_NOMBRE_USUARIO
const passwordGenerico = "12345678"

describe(`TEST: ${url}`, () => {
  beforeEach(async () => {       
    await prisma.usuario.deleteMany()
    usuario1 = await prisma.usuario.create({ data: { nombre: nombreUsuario1, password: passwordGenerico, email: "usuario1@test.com", rol: "ADMIN" } })
    usuario2 = await prisma.usuario.create({ data: { nombre: nombreUsuario2, password: passwordGenerico, email: "usuario2@test.com", rol: "USER" } })        
  })

  afterAll(async () => {
    prisma.$disconnect()
    server.close()
  })

  it.skip("debe existir un función llamada obtenerUsuarios", () => {
    //expect(typeof UsuarioController.obtenerUsuarios).toBe("function")
  })

  it("debe existir un función llamada obtenerUsuario", () => {
    expect(typeof UsuarioController.obtenerUsuario).toBe("function")
  })

  it("debe existir un función llamada registrarUsuario", () => {
    expect(typeof UsuarioController.registrarUsuario).toBe("function")
  })

  it.skip("debe existir un función llamada actualizarUsuario", () => {
    //expect(typeof UsuarioController.actualizarUsuario).toBe("function")
  })

  it.skip("debe existir un función llamada borrarUsuario", () => {
    //expect(typeof UsuarioController.borrarUsuario).toBe("function")
  })

  it.skip("debe existir un función llamada loginUsuario", () => {
    //expect(typeof UsuarioController.loginUsuario).toBe("function")
  })


  it("GET - debe devolver un usuario", async () => {
    const res = await request(server).get(url + usuario1.id)
    expect(res.statusCode).toBe(StatusCodes.OK)
    expect(res.body.status).toBe(Constant.SUCCESS)           
    expect(res.body.message).toBe("")
    expect(res.body.data.nombre).toBe(usuario1.nombre)
    expect(res.body.data.email).toBe(usuario1.email)
    expect(res.body.data.rol).toBe(usuario1.rol)
    expect(res.body.data.password).toBeDefined()  
    expect(res.body.meta).toBeDefined()  
    expect(res.body.data.id).toBeDefined()
  })

  it("GET - debe devolver un error 404 si el usuario no existe", async () => {         
    const id = 999999999
    const res = await request(server).get(url + id)
    expect(res.statusCode).toBe(StatusCodes.NOT_FOUND)   
    expect(res.body.status).toBe(Constant.ERROR)
    expect(res.body.message).toBe(Message.USUARIO_NO_ENCONTRADO)   
  })  





  it("POST - debe registrar un usuario correctamente", async () => {
    const usuario = { nombre: "Usuario 3", email: "usuario3@test.com", password: passwordGenerico, rol: Constant.ROL_ADMIN }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.CREATED)
    expect(res.body.status).toBe(Constant.SUCCESS)
    expect(res.body.message).toBe(Message.USUARIO_REGISTRADO)
    expect(res.body.data).toBeDefined()       
  })

  it("POST - debe devolver un error 400 cuando no se facilita el nombre del usuario", async () => {
    const usuario = { email: "usuario3@test.com", password: passwordGenerico, rol: Constant.ROL_ADMIN }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.USUARIO_NOMBRE_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el email del usuario", async () => {
    const usuario = { nombre: "Usuario 3", password: passwordGenerico, rol: Constant.ROL_ADMIN }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.USUARIO_EMAIL_REQUERIDO)
  })

  it("POST - debe devolver un error 400 cuando no se facilita el password del usuario", async () => {
    const usuario = { nombre: "Usuario 3", email: "usuario3@test.com", rol: Constant.ROL_ADMIN }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.USUARIO_PASSWORD_REQUERIDO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del usuario es inferior a ${longitudMinimaNombreUsuario} caracteres`, async () => {
    const usuario = { nombre: "xx" }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)          
    expect(res.body.status).toBe(Constant.ERROR)        
    expect(res.body.message).toBe(Message.USUARIO_NOMBRE_CORTO)
  })

  it(`POST - debe devolver un error 400 cuando el nombre del usuario es superior a ${longitudMaximaNombreUsuario} caractares`, async () => {
    let usuario = { 
      nombre: new Array(longitudMaximaNombreUsuario+2).join('a'),
      password: passwordGenerico,
      rol: Constant.ROL_ADMIN,
      email: "usuario3@test.com"
    }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)          
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.USUARIO_NOMBRE_LARGO)
  })

  it("POST - debe devolver un error 400 cuando el email del usuario no es válido", async () => {
    let usuario = { 
      nombre: "Usuario 3",
      password: passwordGenerico,
      rol: Constant.ROL_ADMIN,
      email: "usuario3@test"
    }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)          
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.USUARIO_EMAIL_FORMATO_NO_VALIDO)
  })

  it("POST - debe devolver un error 400 cuando el nombre del usuario no es una cadena de texto", async () => {
    let usuario = { 
      nombre: 9999,
      password: passwordGenerico,
      rol: Constant.ROL_ADMIN,
      email: "usuario3@test"
    }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.status).toBe(Constant.ERROR)          
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST)
    expect(res.body.message).toBe(Message.USUARIO_NOMBRE_CADENA)
  })

  it("POST - debe devolver un error 400 si el usuario ya existe en la base de datos", async () => {        
    const usuario = { nombre: "Usuario", password: passwordGenerico, rol: Constant.ROL_ADMIN, email: "usuario2@test.com" }
    const res = await request(server).post(url).send(usuario)
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST)  
    expect(res.body.status).toBe(Constant.ERROR)             
    expect(res.body.statusCode).toBe(StatusCodes.BAD_REQUEST) 
    expect(res.body.message).toBe(Message.USUARIO_YA_EXISTE)
  })










})