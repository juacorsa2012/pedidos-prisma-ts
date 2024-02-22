import { Router } from "express"
import { CreateUsuarioSchema, UpdateUsuarioSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { UsuarioController } from "../controllers"

export const usuarioRouter: Router = Router()

usuarioRouter.get('/:id', UsuarioController.obtenerUsuario)

usuarioRouter.post('/', validateSchema(CreateUsuarioSchema), UsuarioController.registrarUsuario)

