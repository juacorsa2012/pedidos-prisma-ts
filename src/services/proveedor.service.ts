import prisma from "../config/prisma"

type Proveedor = {
  id: number;
  nombre: string;  
}

export class ProveedorService {
  static async registrarProveedor (nombre: string) {
    return await prisma.proveedor.create({ data: { nombre } }) }

  static async obtenerProveedor (id: number) {
    return await prisma.proveedor.findUnique({ where: { id }})
  }

  static async existeProveedor (nombre: string) {
    const search = nombre.toLowerCase().trim()    
    const proveedor = await prisma.proveedor.findFirst({ where: { nombre: search } })         
    return proveedor == null ? false : true
  }

  static async obtenerTotalProveedores () {
    return await prisma.proveedor.count()
  }

  static async actualizarProveedor (id: number, nombre: string) {   
    return await prisma.proveedor.update({
      where: { id },
      data: {
        nombre        
      }
    })    
  }
}
