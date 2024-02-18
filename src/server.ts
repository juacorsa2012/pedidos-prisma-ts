import "dotenv/config"
import { logger } from "./config/logger"
import { Constant } from "./config/constants"

import { app } from "./app"

const PORT = process.env.PORT || 3000

export const server = app.listen(PORT, () => {
  logger.info(`${Constant.SERVIDOR_INICIADO} ${PORT}`)
})