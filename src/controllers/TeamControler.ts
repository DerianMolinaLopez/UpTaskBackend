import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';
class TeamControllerMember{
    static async findMemberByEmail(req:Request,res:Response){
    
    const {email} = req.body
    const userExist = await User.findOne({email}).select('name email')
    if(!userExist) return res.status(401).json({message:new Error('Usuario no encontrado').message})
   
    res.send(userExist)

    }
    static async getAllMembers(req:Request,res:Response){
        const {project} = req.params
        const projectExist = await Project.findById(project).populate({
            path:'team',
            select:'name email'
        })
        res.json(projectExist.team)
    }

    static async addMemberById(req:Request,res:Response){
        const {_id} = req.body
        const {project} = req.params
        const userExist = await User.findOne({_id}).select('id')
        const projectExist = await Project.findById(project)
        if(!userExist) return res.status(401).json({message:new Error('Usuario no encontrado').message})
         
        if(projectExist.team.some(team => team._id.toString()===userExist._id.toString())) return res.status(409).json({message:new Error('Usuario ya esta en el equipo').message})
        projectExist.team.push(userExist)
        await  projectExist.save()
        res.send("Usuario agregado al equipo")
        }
      
        static async removeMemberById(req: Request, res: Response) {
            //"/:project/team/:userId",
          try {
            const {project,userId} = req.params
            console.log(project,userId)
            const userExist = await User.findById(userId).select("_id")
            const projectExist = await  Project.findById(project)
            console.log(userExist,projectExist)

            if(!userExist) return res.status(401).json({message:new Error('Usuario no encontrado').message})
            if(!projectExist) return res.status(401).json({message:new Error('Proyecto no encontrado').message})
            //verificamos si el usuario esta en ese equipo
            if(!projectExist.team.some(team => team._id.toString()===userExist._id.toString())) return res.status(409).json({message:new Error('Usuario no esta en el equipo').message})
            //entonces lo eliminamos filtrando
            projectExist.team = projectExist.team.filter(team => team._id.toString()!==userExist._id.toString())  
             await projectExist.save()
              res.status(200).json({ message: "Miembro eliminado" });
          } catch (error) {
              console.error(error);
              res.status(500).json({ error: 'Error interno del servidor' });
          }
      }

}
export default TeamControllerMember