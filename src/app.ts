import express from "express"
import * as dotevnv from "dotenv"
import cors from "cors"
import helmet from "helmet"
import {setupRoutes} from "./routes";

dotevnv.config()

if (!process.env.PORT) {
  console.error(`No port value specified!`)
}

const PORT = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
app.use(helmet())

setupRoutes(app);

app.listen(PORT, () => {
  console.info(`Server is listening on port ${PORT}`)
})
