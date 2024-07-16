import server from './server'
import mongoose from 'mongoose'
import colors from 'colors'//-> maneja colores llamativos para saber si hay un error
const port = process.env.PORT||4000 
mongoose.set('strictQuery',false)
server.listen(port,()=>{
    console.log(colors.cyan.bold('aplicacion corriendo en el puerto 4000'))
})