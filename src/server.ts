import express from 'express'
import dontenv from 'dotenv'
import { conectDB } from './config/db'
import ProyectRoutes from './routes/ProyectRoutes'
import router  from './routes/authRoute'
import cors from 'cors'
import mongoose from 'mongoose'
import corsConfig from './config/cors'
import colors from 'colors'
import morgan from 'morgan'

dontenv.config()//es para la lectura de variabels de entorno
conectDB()
const app = express()
app.use(cors(corsConfig))
app.use(morgan('dev'))
app.use(express.json())//habilitamos la lectura de json en metodos http
mongoose.set('strictQuery',false)
//routes
console.log(colors.bgMagenta.black('antes de la ruta'))

app.use('/api/auth',router)

app.use('/api/projects',ProyectRoutes)

export default app