import type { Request,Response } from "express";
import Note,{INote} from "../models/Note";
import Task from "../models/Tasks";
import Types from 'mongoose'
import colors from "colors"
import { populate } from "dotenv";
type NoteParams = {
    noteId  : Types.ObjectId
}
class NoteController{
    static async createNote (req:Request<{},{},INote>,res:Response){
     

        try{
              // const {task} = req.params
  
            const note = new Note()
            note.content = req.body.content

            console.log(req.body.content)
            note.task = req.task._id
            note.createdBy = req.user.id
         
            req.task.notes.push(note._id)
     
           await Promise.allSettled([note.save(),req.task.save()])
            res.send("Nota creada cone exito")
        }catch(e){
            console.log(e)
            res.status(500).json({msg:'Error en el servidor'})
        
        }
       
    }
    static async getTaskNotes (req:Request<{},{},INote>,res:Response){
        try{
          const task = await Task.findById(req.task._id)
         
                                  .populate({path:'completedBy',populate:{path:"user",select:"id,email name"} })
                                  .populate({path:"notes", populate:{path:"createdBy", select:"id email name"} })
                                  
          res.send(task)
        }catch(error){
            console.log(error)
            res.status(500).json({msg:'Error en el servidor'})
        }
    }
    static async deleteNote (req:Request<NoteParams>,res:Response){
        try{
        const {noteId} = req.params 
        const note = await Note.findById(noteId)    
        if(!note){
            return res.status(404).json({msg:'La nota no existe'})
        }
        if(note.createdBy.toString() !== req.user.id.toString()){
            return res.status(401).json({msg:'No autorizado'})
        }

       // note.deleteOne()
        req.task.notes = req.task.notes.filter(note => note._id.toString() !== noteId.toString())
        await Promise.allSettled([note.save(),req.task.save()])
        res.send("Nota eliminada")
        }catch(error){
            console.log(error)
            res.status(500).json({msg:'Error en el servidor'})
        }
    }
}
export default NoteController