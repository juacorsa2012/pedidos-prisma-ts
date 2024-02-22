import { Router } from "express"
import { CreatePedidoSchema, UpdatePedidoSchema } from "../schemas"
import { validateSchema } from "../middlewares/validateSchema"
import { PedidoController } from "../controllers"

export const pedidoRouter: Router = Router()

pedidoRouter.post('/', validateSchema(CreatePedidoSchema), PedidoController.registrarPedido)
