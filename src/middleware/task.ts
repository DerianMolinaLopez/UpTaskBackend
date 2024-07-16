import Task,{Tasks} from "../models/Tasks"
import { Request,Response,NextFunction } from "express" 
import moongose from 'mongoose'
//agregamos mas campos por medio de una interface
//con el objetivo de que al request peuda tener el
//valor del proyecto y asi puedo leerlo sin tener que comunicar
//los archivos entre este middleware y la siguiente funcion

declare global{
    namespace Express{
        interface Request {
            task:Tasks
        }
    }
}

export async function validateTaskExists(req:Request,res:Response,next:NextFunction){
    try{
        const {taskId}= req.params

        const task = await Task.findById(taskId)
       
        if(!task){
            return res.status(500).json({msg:'Task not found'})
        }
        req.task=task
    
    
        next()
    }catch(error){
        console.log(error)
        if (error instanceof moongose.Error) {
            res.status(400).json({Error:'Invalid project ID'})
        } else {
            res.status(500).json({Error:'Server error'})
        }
    }
}
export async function validateTaskBelongsToProject(req:Request,res:Response,next:NextFunction){

    try{
        //segundo filtro, verificamos si la tare pertenece a ese proyecto
       
        if(req.task.project.toString() !== req.project._id.toString()){
            return res.status(404).json({msg:'Those task donbelogn to that project'})
        }
        //una vez todos los filtros listos, adelante ya podemos continuar
        next()
    }catch(e){
       console.log(e)

        res.status(500).json({msg:'Error en el servidor'})
    }
    }



    export async function hasAutoritation(req:Request,res:Response,next:NextFunction){
        try{
        
            if(req.user.id.toString()!== req.project.manager.toString()){
                return res.status(404).json({message:'Accion no valida'})
            }

            next()
        }catch(e){
           
            res.status(500).json({msg:'Error in the server'})
        }
        }