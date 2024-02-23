import { Router } from "express"
import { CreateUsuarioSchema, UpdateUsuarioSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { UsuarioController } from "../controllers"
import { isAuth, isRol } from "../middlewares/auth"

export const usuarioRouter: Router = Router()

usuarioRouter.get('/', UsuarioController.obtenerUsuarios)

usuarioRouter.get('/:id', UsuarioController.obtenerUsuario)

usuarioRouter.post('/', validateSchema(CreateUsuarioSchema), UsuarioController.registrarUsuario)

usuarioRouter.delete('/:id', UsuarioController.borrarUsuario)

usuarioRouter.put('/:id', validateSchema(UpdateUsuarioSchema), UsuarioController.actualizarUsuario)