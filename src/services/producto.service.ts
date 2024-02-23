import prisma from "../config/prisma"

type Producto = {
  id: number;
  nombre: string;  
}

export class ProductoService {
  static async registrarProducto (nombre: string) {
    return await prisma.producto.create({ data: { nombre } }) }

  static async obtenerProducto (id: number) {
    return await prisma.producto.findUnique({ where: { id }})
  }

  static async existeProducto (nombre: string) {
    const search = nombre.toLowerCase().trim()    
    const producto = await prisma.producto.findFirst({ where: { nombre: search } })         
    return producto == null ? false : true
  }

  static async obtenerTotalProductos () {
    return await prisma.producto.count()
  }

  static async actualizarProducto (id: number, nombre: string) {   
    return await prisma.producto.update({
      where: { id },
      data: {
        nombre        
      }
    })    
  }
}
