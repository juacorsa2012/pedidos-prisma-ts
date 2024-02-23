import { PrismaClient } from "@prisma/client"
import { logger } from "../config/logger"
import { Constant } from '../config/constants'

const prisma = new PrismaClient()

const estados = [Constant.ESTADO_PREPARADO, Constant.ESTADO_FACTURADO, Constant.ESTADO_PEDIDO, Constant.ESTADO_ENTREGADO]

function getRandomInt(min:number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRamdomText(length: number) {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

function getRandomChoice(array: any) {
  return array[Math.floor(Math.random() * array.length)]
}

async function seed(n: number) {
  const registrosClientesProductosProveedores = 10
  const tablas = ['pedidos', 'clientes', "productos", "proveedores"]

  for (const tabla of tablas) 
    await prisma.$queryRawUnsafe(`TRUNCATE "${tabla}" RESTART IDENTITY CASCADE`)    
        
  for (let i = 0; i < registrosClientesProductosProveedores; i++) {   
    await prisma.cliente.create({ data: { nombre: `Cliente ${i}` }})  
    await prisma.producto.create({ data: { nombre: `Producto ${i}` }})  
    await prisma.proveedor.create({ data: { nombre: `Proveedor ${i}` }})  
  }        

  for (let i = 0; i < n; i++) {   
    await prisma.pedido.create({ 
      data: { 
        clienteId: getRandomInt(1, registrosClientesProductosProveedores),
        productoId: getRandomInt(1, registrosClientesProductosProveedores),
        proveedorId: getRandomInt(1, registrosClientesProductosProveedores),
        unidades: getRandomInt(1, 10),
        parte: getRandomInt(5000, 99999),
        estado: getRandomChoice(estados),
        observaciones: getRamdomText(500),
        modelo: getRamdomText(10),
        oferta: getRandomInt(1, 999).toString(),
        referencia: getRamdomText(10),
      }})       
      let progreso = Math.ceil((i/n)*100) + '%'
      process.stdout.write('Progreso: ' + progreso + '\r')
  }      
}
  
const n = +process.argv[2] 

seed(n)
  .then(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    logger.error(e.message)
    await prisma.$disconnect()
    process.exit(1)
  })