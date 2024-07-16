import Project, { projectType } from "../models/Project"
import { Request,Response,NextFunction } from "express" 
import moongose from 'mongoose'
//agregamos mas campos por medio de una interface
//con el objetivo de que al request peuda tener el
//valor del proyecto y asi puedo leerlo sin tener que comunicar
//los archivos entre este middleware y la siguiente funcion

declare global{
    namespace Express{
        interface Request {
            project:projectType
        }
    }
}

export async function validateProjectExists(req:Request,res:Response,next:NextFunction){
    try{
       
        const {projectID}=req.params
        const project = await Project.findById(projectID)
        if(!project ){
            return res.status(404).json({msg:'Project not found'})
        }
        req.project = project
     
        next()
    }catch(error){
        if (error instanceof moongose.Error) {
            res.status(400).json({Error:'Invalid project ID'})
        } else {
            res.status(500).json({Error:'Server error'})
        }
    }
}