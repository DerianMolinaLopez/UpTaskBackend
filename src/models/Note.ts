import mongoose, {Schema,Document,Types} from 'mongoose';
export interface INote extends Document{
    content:string
    createdBy:Types.ObjectId
    task:Types.ObjectId

}
const noteSchema = new Schema<INote>({
    content:{
        type:String,
        required:true,
        trim:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',//referencia al documento de usuarios
        required:true
    },
    task:{
        type:Schema.Types.ObjectId,
        ref:'Task',//hacemos referencia al documento de tareas
        required:true
    }
    

},
{
    timestamps:true
})

const Note = mongoose.model<INote>('Note',noteSchema)
export default Note