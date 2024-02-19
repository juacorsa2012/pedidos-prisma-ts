import prisma from "../config/prisma"

type Producto = {
  id: number;
  nombre: string;  
}

export class ProductoService {
  static async registrarProducto (nombre: string): Promise<Producto> {
    return await prisma.producto.create({ data: { nombre } }) }

  static async obtenerProducto (id: number): Promise<Producto | null> {
    return await prisma.producto.findUnique({ where: { id }})
  }

  static async existeProducto (nombre: string): Promise<boolean> {
    const search = nombre.toLowerCase().trim()    
    const producto = await prisma.producto.findFirst({ where: { nombre: search } })         
    return producto == null ? false : true
  }

  static async obtenerTotalProductos (): Promise<number> {
    return await prisma.producto.count()
  }

  static async actualizarProducto (id: number, nombre: string): Promise<Producto | null> {   
    return await prisma.producto.update({
      where: { id },
      data: {
        nombre        
      }
    })    
  }
}
