import jwt from "jsonwebtoken";
import Types from "mongoose";
type UserPayload = {
    _id:Types.ObjectId,
}
export const generateJWT =(payload :UserPayload )=>{
    /*
    toma 3 parametros
    1. payload: la informacion que se quiere guardar en el token
    2. clave secreta: para firmar el token
    3. opciones: configuracion del token
    */
   const data = {
         _id:payload._id
   }
    const token = jwt.sign({
        data
    },process.env.JWT_SECRET,{
        expiresIn:'6h'
    })
    return token
}