import { Router } from "express"
import { CreatePedidoSchema, UpdatePedidoSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { PedidoController } from "../controllers"
import { isAuth, isRol } from "../middlewares/auth"

export const pedidoRouter: Router = Router()

pedidoRouter.get('/', PedidoController.obtenerPedidos)

pedidoRouter.get('/:id', PedidoController.obtenerPedido)

pedidoRouter.post('/', validateSchema(CreatePedidoSchema), PedidoController.registrarPedido)

pedidoRouter.delete('/:id', PedidoController.borrarPedido)

pedidoRouter.put('/:id',validateSchema(UpdatePedidoSchema), PedidoController.actualizarPedido)
