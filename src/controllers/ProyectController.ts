// normalemnte los controladores son clases
import type { Request, Response } from 'express';//son los tipados para las peticiones
import Project from '../models/Project';
export class ProyectController {
    static createProject = async (req: Request, res: Response) => {

        const project = new Project(req.body)//!este proyecto es el midmo que se exporta en el modelo, es de un tipo de schema
       // console.log(req.body)
        //console.log('/********/')
        
        project.manager = req.user//el usuario que esta creando el proyecto
 
        try {
            await project.save()//tengo acceso al save gracias a que es un modelo de moongose
            res.send('Proyect has been created')

        } catch (error) {
            console.log(error)
            res.status(500).send('There was has a error creating the new project')
        }



    }
    //usaremos metodos estaticos 
    static getAllProjects = async (req: Request, res: Response) => {
        /*
        Basicamente, hacemos una consulta condicional, traer todos los proeyctos
        si tu id es el de manager, entonces lo trae
        pero si tu id esta en la lista de team
        entonces tambien lo regresa
        */
        try {
            // Consulta condicional para obtener todos los proyectos de un usuario específico
            const projects = await Project.find({
                $or: [
                    { "manager": { $in: [req.user._id] } },
                    { "team":    { $in: [req.user._id] } }
                ]
            }); 
            res.status(200).json(projects);
        } catch (error) {
            console.error(error.message); // Usar console.error para errores
            res.status(500).send('Server error'); // Enviar respuesta de error al cliente
        }
    }
    static getProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        console.log(id)
        try {
            const project = await Project.findById(id).populate('tasks')//buscamos el proyecto bajo un id
            console.log(project)
            if(!project){
                return res.status(404).send('The project does not exist')
            }
            if(project.manager.toString() !== req.user._id.toString()
               &&!project.team.includes(req.user._id.toString())){
                return res.status(404).send('Accion no valida')
            }
                res.status(200).json(project)
        } catch (error) {
            console.log(error.message)

        }
      
    }
    static updateProject = async (req: Request, res: Response) => { 
        const {id} = req.params
        try{
            const project = await Project.findByIdAndUpdate(id,req.body)
            if(!project){
                return res.status(404).send('The project does not exist')
            }
            if(project.manager.toString() !== req.user._id.toString()){
                return res.status(404).send('Solo el manager puede actualizar el proyecto')
            }
            await project.save()
            res.send('The project has been updated')
            
        }catch(error){
            console.log(error.message)
            res.status(500).send('Server error')
        
        }
        //cuando se actualiza, se busca, y se verifica que es lo que vas a actualizar
       // res.send('update project')
    }
    static deleteProject =async(req: Request, res:Response) => {
        const {id} = req.params
         
        try{
            const project =await Project.findById(id)//buscamos e proyecto y lo eliminamos
            if(!project ){
               return  res.send('The project does not exist')
            }
            if(project.manager.toString() !== req.user._id.toString()){
                return res.status(404).send('Solo el manager puede eliminar el proyecto')
            }
            await project.deleteOne()//elimiacion de un documento
            res.send('The project has been deleted')
            
        }catch(error){
            console.log(error.message)
        }
    }
    
}