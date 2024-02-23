import prisma from "../config/prisma"

export type Usuario = {
  id?: number;
  nombre: string;  
  password: string;
  email: string;
  rol: string;
}

export class UsuarioService {  
  static async registrarUsuario (usuario: Usuario): Promise<Usuario> {
    return await prisma.usuario.create({ 
      data: {
        nombre: usuario.nombre,
        password: usuario.password,
        email: usuario.email
      }
    })
  }
  
  static async buscarUsuarioPorEmail (email: string) {
    return await prisma.usuario.findUnique({ where: { email } })
  }
    
  static async obtenerUsuario (id: number) {
    return await prisma.usuario.findUnique({ where: { id }})
  }
  
  static async borrarUsuario (id: number) {
    await prisma.usuario.delete({ where: { id} })
  }
  
  static async obtenerTotalUsuarios () {
    return await prisma.usuario.count()
  }
  
  static async actualizarUsuario (id: number, usuario: Usuario) {   
    return await prisma.usuario.update({
      where: { id },
      data: {
        nombre: usuario.nombre,
        password: usuario.password,
        email: usuario.email
      }
    })    
  }
}