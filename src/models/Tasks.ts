import monngoose,{Schema,Document,Types,PopulatedDoc} from 'mongoose';
import Note from './Note';
import colors from 'colors'

const status ={
    PENDING:'pending',
    ON_HOLD:'on_hold',
    IN_PROGRESS:'in_progress',
    UNDERVIEW:'underview',
    COMPLETED:'completed'
} as const //esto es para que no se pueda modificar el objeto status
//con ese arreglo, el type solo acepta status del objeto de status ademas de que nop es mutable
export type TaskStatus= typeof status[keyof typeof status] //esto es para que el tipo de dato sea el mismo que el objeto status
export interface Tasks extends Document{
    name:string
    description:string  
    project:Types.ObjectId//mongodb nos permite usar sus types 
    status:TaskStatus
    completedBy:{
        user:Types.ObjectId
        status:TaskStatus
    }[]
    notes:Types.ObjectId[]
    
    

}
 
export const TaskSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project' // Corregir aquí
    },
    
    status:{
        type:String,
        enum:Object.values(status),
        default:status.PENDING
    },
    completedBy : [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(status),
                default: status.PENDING
            }
        }
    ],
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'//apuntamos a la coleccion de notas
        }
    
    ]
    
})
//middleware
//mas que un middleware, esto es un trihher
TaskSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const taskId = this._id;
    console.log(colors.bold.bgGreen(`Deleting task with ID: ${taskId}`));
    if (!taskId) return 
    // Eliminamos todas las notas relacionadas a la tarea
    await Note.deleteMany({ task: taskId });
    next();
});
const Task = monngoose.model<Tasks>('Task',TaskSchema) //listo con pocas liunea sde codigo tenemos el esquema creado con el modelo que manejara inserciones del moongodb
export default Task