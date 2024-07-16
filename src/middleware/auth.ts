import { Request, Response, NextFunction } from 'express';
import colors from 'colors'
import User from '../models/User';
import { UserInter } from '../models/User';
import jwt, { decode } from 'jsonwebtoken'

declare global {//necesitamos enviar por express el user, asi que lo reescribimos de esta manera
    namespace Express {
        interface Request {
            user?: UserInter
        }
    }
}

export const  autenticate = async(req: Request, res: Response, next: NextFunction) => {

    const barer = req.headers.authorization
    if(!barer) return res.status(401).json({error:new Error('Token no valido').message})
    try{
       
        const decoded = jwt.verify(barer.split(' ')[1], process.env.JWT_SECRET)
        if(typeof decoded === 'object' && decoded.data) {
          
            const usuarioExist = await User.findById(decoded.data._id)
            if(!usuarioExist) return res.status(401).json({error:new Error('Usuario no encontrado').message})
            req.user = usuarioExist
           
        } 
    }catch(error){
        res.status(500).send("Error en el servidor desde la autenticacion")
    }
    next()
 
}