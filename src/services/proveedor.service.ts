import prisma from "../config/prisma"

type Proveedor = {
  id: number;
  nombre: string;  
}

export class ProveedorService {
  static async registrarProveedor (nombre: string): Promise<Proveedor> {
    return await prisma.proveedor.create({ data: { nombre } }) }

  static async obtenerProveedor (id: number): Promise<Proveedor | null> {
    return await prisma.proveedor.findUnique({ where: { id }})
  }

  static async existeProveedor (nombre: string): Promise<boolean> {
    const search = nombre.toLowerCase().trim()    
    const proveedor = await prisma.proveedor.findFirst({ where: { nombre: search } })         
    return proveedor == null ? false : true
  }

  static async obtenerTotalProveedores (): Promise<number> {
    return await prisma.proveedor.count()
  }

  static async actualizarProveedor (id: number, nombre: string): Promise<Proveedor | null> {   
    return await prisma.proveedor.update({
      where: { id },
      data: {
        nombre        
      }
    })    
  }
}
