import moongose from 'mongoose';
import colors from 'colors';

export const conectDB = async()=>{
    try{
        //en esta forma a coparacion del curso anterior, requeria mucho mas 
        //codigo para conectarse a la base de datos
    
        const connection = await moongose.connect(process.env.DATABASE_URl)
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.green.bold(`Mongodb has been conected in the port ${url}`))

    }catch(e){
        console.log(colors.red.bold(e.message))
        console.log(colors.red.bold('Error in the connection'))
        process.exit(1)//quiere decir que el programa fallo y se  detiene
    }
}