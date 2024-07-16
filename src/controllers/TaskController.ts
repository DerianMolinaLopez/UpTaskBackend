import Type, { Request, Response } from 'express'
import Task from '../models/Tasks'
import Project from '../models/Project'
import colors from 'colors'
import User from '../models/User'
export class TaskController {
    static async createTask(req: Request, res: Response) {
        //el objetivo es buscar el proyecto el en cual nos interesa 
        // agregar esa tarea
        console.log(req.project)

        try {

            const task = new Task(req.body)
            task.project = req.project.id
            console.log('antes del push')
            req.project.tasks.push(task.id)
            //!--> ejecucion de todas las promesas sin tener que tener un doble await
            await Promise.allSettled([task.save(), req.project.save()])

        } catch (e) {
            console.log(e.meesage)
        }

        res.send('tarea creada')
    }

    static async getProjectTask(req: Request, res: Response) {
        console.log('antes del error')
        console.log(req.project.id)
        try {
            const task = await Task.find({ project: req.project.id }).populate('project')
            res.json({ task })
        } catch (e) {
            res.status(500).json({ msg: 'Error in the server' })
        }
    }
    static async getTaskByID(req:Request,res:Response){
       
        try{
            //una vez todos los filtros listos, adelante ya podemos continuar
            const task = await Task.findById(req.task.id)
                                   .populate({path:'completedBy.user',
                                              select:'id name email'
                                   }).populate({path:"notes" ,populate:{path:'createdBy',select:'id name email'}})
                                
                                   //proyeccion hacia el populate
                                   console.log(task)

            res.json(task)
        }catch(e){
            console.log(e.message)
            res.status(500).json({msg:'Error in the server'})
        }
        }
    static async updateTask(req: Request, res: Response) {

        try {
            ///:projectID/tasks/:taskId
            const { projectId, taskId } = req.params
            const {name,description}=req.body
            console.log(projectId, taskId)

            //segundo filtro, verificamos si la tare pertenece a ese proyecto
            if (req.task.project.toString() !== req.project.id) {
                return res.status(404).json({ msg: 'Those task do not belogn to that project' })
            }
            //actualizamos la tarea
            const task = await Task.findById(taskId)
            task.name=name
            task.description=description
            await task.save()
            //una vez todos los filtros listos, adelante ya podemos continuar
            res.json('Task updated')
        } catch (e) {
            console.log(e.message)
            res.status(500).json({ msg: 'Error in the server' })
        }
    }
    static async deleteTask(req: Request, res: Response) {
        try {
           
            
            console.log('probando')
            //segundo filtro, verificamos si la tarea pertenece a ese proyecto
            if (req.task.project.toString() !== req.project.id) {
                return res.status(400).json({ msg: 'Those task donbelong to that project' })
            }
            // Filter the tasks and update the project
           
            req.project.tasks = req.project.tasks.filter(taskIdInProject => taskIdInProject.toString() !==req.task.id)
            
            await Promise.allSettled([req.task.deleteOne(),req.project.save()])
          
            res.send('Task has been deleted')
        } catch (e) {
            console.log(e.message)
            res.status(500).json({ msg: 'Error in the server' })
        }
    }
    static async updateStateTask(req: Request, res: Response) {
        try{
         
            const  {status}=req.body
        
            req.task.status = status
            //si el la tarea vuelve a estar en pending entonces
            //no es posible qeu hay alguien que la comoleto
            //asi que agregarmos esta logica para que no 
            //pueda almacenar a quien la regreso
                      
            console.log(colors.green.bold( req.user.id))
            req.task.completedBy.push({
                user:req.user.id,
                status
            })
             console.log(req.task) 
            await req.task.save()
            res.send('State of task has been update')
        }catch(e){
            console.log(e.message)
            res.send("Error en el servidor")
        }
    }
    
    
}
