import prisma from "../config/prisma"

type Cliente = {
  id: number;
  nombre: string;
  activo: boolean;
}

export class ClienteService {
  static async registrarCliente (nombre: string): Promise<Cliente> {
    return await prisma.cliente.create({ data: { nombre } }) 
  }

  static async obtenerCliente (id: number): Promise<Cliente | null> {
    return await prisma.cliente.findUnique({ where: { id }})
  }

  static async existeCliente (nombre: string): Promise<boolean> {
    const search = nombre.toLowerCase().trim()    
    const cliente = await prisma.cliente.findFirst({ where: { nombre: search } })         
    return cliente == null ? false : true
  }

  static async obtenerTotalClientes (): Promise<number> {
    return await prisma.cliente.count()
  }

  static async actualizarCliente (id: number, nombre: string, activo: boolean): Promise<Cliente | null> {   
    return await prisma.cliente.update({
      where: { id },
      data: {
        nombre,
        activo
      }
    })    
  }
}
