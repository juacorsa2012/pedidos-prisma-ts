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
    return await prisma.usuario.findUnique({ 
      where: {
        email
      }
     })
  }

  
  /*
  static async obtenerUsuario (id: string) {
    return await UsuarioModel.findOne({ _id: id })
  }

  static async borrarUsuario (id: string) {
    return await UsuarioModel.findByIdAndDelete(id)
  }

  static async obtenerTotalUsuarios () {
    return await UsuarioModel.countDocuments()
  }

  static async actualizarUsuario (id: string, usuario: Usuario) {
    await UsuarioModel.findByIdAndUpdate(id, usuario)
    //return await UsuarioModel.findOne({ _id: id })
  }*/
}