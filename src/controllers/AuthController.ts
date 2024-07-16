import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt'

import Token from '../models/Token';
import { generacionToken } from '../utils/generacionToken';
import transport from '../config/nodemeadler';
import { generateJWT } from '../utils/jwt';
import EmailAuth from '../emails/EmailAuth';
import { ReadConcern } from 'mongodb';
export default class AuthController {
    static async createAccount(req:Request,res:Response){
        //nombre de usuario,password y email de registro
       // res.send('desde el controlador')
        try{
            const { email} = req.body
            const user = new User(req.body) //no toma valores adicionales, solamente lo que esta en el body
            const userExist = await User.findOne({email})
            if(userExist) return res.status(409).json({msg:new Error('El usuario ya existe').message})
            
            const token = new Token()
            token.token = generacionToken()
            token.user = user._id
             
            user.password = await bcrypt.hash(req.body.password,10)
          //  await user.save()

          //enviamos el email
          EmailAuth.sendConfirmationEmail({
                name:user.name,
                token:token.token,
                email:user.email
          })
            await Promise.allSettled([token.save(),user.save()])
            res.send('Cuenta creada, debes revisar tu email')

        }catch(error){
            console.log(error.message)
            res.status(500).send('Hubo un error al crear la cuenta')
        }
    }
    static async confirmAccount(req:Request,res:Response){
        try{
            const {token} = req.body
            const tokenExist = await Token.findOne({token})
            if(!tokenExist) return res.status(401).json({msg:new Error('El token no existe').message})
           const user = await User.findById(tokenExist.user)
           user.confirmed = true
           console.log(user)
           await Promise.allSettled([user.save(),tokenExist.remove()])
           res.send("usuario confirmado")
        }catch(error){
            console.log(error.message)
            res.status(500).send('Hubo un error al confirmarla cuenta')
        }
    }
    static async login(req:Request,res:Response){
        try{
            const {email,password} = req.body
            const usuarioExist = await User.findOne({email})
            if(!usuarioExist) return res.status(401).json({error:new Error('El usuario no existe').message})
            const passwordMatch = await bcrypt.compare(password,usuarioExist.password)
            if(!passwordMatch) return res.status(401).json({error:new Error('El la contraseña no coincide').message})
  
            if(!usuarioExist.confirmed){
                 const token = new Token()
                 token.token = generacionToken()
                 token.user = usuarioExist._id
                 await token.save()
                //mandamo el email
                   EmailAuth.sendConfirmationEmail({
                    name:usuarioExist.name,
                    token:token.token,
                    email:usuarioExist.email
               })
               return res.status(401).json({error:new Error('No has confirmado la cuenta, verifica tu email o solicita un nuevo codigo de confirmacion').message})
              
      
            } 
            
                  

                const jwt = generateJWT({_id:usuarioExist._id})
                
                res.send(jwt)
                  
           
        }catch(error){
            console.log(error.message)
            res.status(500).send('Hubo un error al iniciar sesion')
        }
}
static async requestConfirmationAccount(req:Request,res:Response){
    try{

        const {email} = req.body
        console.log(email)
        const usuarioExist = await User.findOne({email})//mandamos los mensajes de error
        if(!usuarioExist) return res.status(401).json({error:new Error('El usuario no esta registrado').message})
        if(usuarioExist.confirmed) return res.status(403).json({error:new Error('El usuario ya esta confirmado').message})    
            //generamos el nuevo token
            const token = new Token()
            token.token = generacionToken()
            EmailAuth.sendConfirmationEmail({
                name:usuarioExist.name,
                token:token.token,
                email:usuarioExist.email
          })
            token.user = usuarioExist._id
    
          await token.save()

          res.send("Se ha enviado un email para confirmar tu cuenta")
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error al solucitar el token')
    }
}
static async forgotPassword(req:Request,res:Response){
    try{
         //*1- Verificar si el usuario existe
        const {email} = req.body
        console.log(email)
        const usuarioExist = await User.findOne({email})//mandamos los mensajes de error
        if(!usuarioExist) return res.status(401)
                                    .json({error:new Error('El usuario no esta registrado').message})
        
        
        
         //generamos el nuevo token
            const token = new Token()
            token.token = generacionToken()
             token.user = usuarioExist._id
            await token.save()
            EmailAuth.sendPasswordResetToken({
                name:usuarioExist.name,
                token:token.token,
                email:usuarioExist.email    
          })
            token.user = usuarioExist._id
        

          res.send("Se ha enviado un email para confirmar tu cuenta")
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error al solucitar el token')
    }
}
static async validateToken(req:Request,res:Response){
    try{
        const {token} = req.body
        const tokenExist = await Token.findOne({token:token})
        console.log(token)
        if(!tokenExist) return res.status(401).json({error:new Error('El token no valido').message})
        
       res.send("Token valido, define tu nueva contraseña")
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error al confirmarla cuenta')
    }
}

static async updatePasswordWithToken(req:Request,res:Response){
    try{
        const {token} = req.body
        const tokenExist = await Token.findOne({token})
        if(!tokenExist) return res.status(401).json({error:new Error('El token no valido').message})
        const user = await User.findById(tokenExist.user)
        user.password = await bcrypt.hash(req.body.password,10)
        await Promise.allSettled([user.save(),tokenExist.deleteOne()])
       res.send("Contraseña actualizada con exito")
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error al confirmarla cuenta')
    }
}
static async user(req:Request,res:Response){
    return res.json(req.user)
}


static async updateProfile(req:Request,res:Response){
    try{
        const {name,email} = req.body
        req.user.name = name
        req.user.email = email
        const userExist = await User.findOne({email })
        /*nececito verificar que el usaurio ya existe, o si el usuaro
           o si el correo del usuairo que esta cambiando, es el mismo
           que el correo del usuario autenticado, entonces realizamos la actualizacion
           ya que es el ususairo con dichas credenciales
        */
        if(userExist && userExist._id.toString() !== req.user._id.toString()){
            return res.status(409)
                      .json({msg:new Error('Ese correo ya esta registrado').message})
        } 
        await req.user.save()//actualizacion
     res.send("Perfil actualizado correctamente")
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error al confirmarla cuenta')
    }
}
static async updateCurrentUserPassword(req:Request,res:Response){
    try{
       const {current_password,password} = req.body
       //comprobamos las contraseñas
       const userExist = await User.findById(req.user._id)
       const isPasswordCorrect = await bcrypt.compare(current_password,userExist.password)
       if(!isPasswordCorrect) return res.status(401).json({error:new Error('La contraseña actual no coincide').message})
        req.user.password = await bcrypt.hash(password,10) 
        await req.user.save()

     res.send("Contraseña modificada correctamente")
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un error al confirmarla cuenta')
    }
}
static async checkPassword(req:Request,res:Response){
    try{
        const {password} = req.body
        console.log(typeof password)
        console.log(password)
        const userExist = await User.findById(req.user._id)
        const isPasswordCorrect = await bcrypt.compare(password,userExist.password)
        if(!isPasswordCorrect){
             return res.status(401).json({error:new Error('La contraseña es incorrecta').message})
        }else{
            res.send("Contraseña correcta")
        }
    }catch(error){
        console.log(error.message)
        res.status(500).send('Hubo un al verificar la contraseña')
    }

  
        
}
}