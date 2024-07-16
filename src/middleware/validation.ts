//es la forma de ejecutar codio antes de una accion de las petisiones
import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'Express-validator';//las mayusculas
//validationResult es a donde se almacenan los errores
//lo treamos para aca para que se pueda reutilizar en cualquier parte de la aplicacion


const  handleInputErrors = (req: Request, res: Response, next: NextFunction) => { 
    let  errors =  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()//brincamos al siguiente middleware
}   
export {handleInputErrors}