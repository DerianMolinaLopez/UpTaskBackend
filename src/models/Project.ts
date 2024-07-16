import mongoose,{Document,Schema,PopulatedDoc} from 'mongoose'
import Task, { Tasks } from './Tasks'
import { UserInter } from './User'
import colors from 'colors'
import Note from './Note'

//tambiem podria ser una interface
export interface projectType extends Document  { //este solo es el type del modelo es apra que el schema peuda saber que es lo que va a recibir
        projectName: string,
        clientName : string,
        description: string,
        tasks: PopulatedDoc<Tasks & Document>[] //aqui se guardaran los id de las tareas que se creen
        manager: UserInter//aqui se guardaran los id de las tareas que se creen
        team: PopulatedDoc<UserInter & Document>[]
    }
    /**
     * 
     * el esquema del cliente consta del nombre del proyecto y el nombre del cliente
     */
    const ProyectSchema : Schema = new Schema({
        projectName:{
            type:String,
            required:true,
            trim:true,
        },
        clientName:{
            type:String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            required:true,
            trim:true,
        },
        manager:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        tasks: [ 
            {
                type:Schema.Types.ObjectId,
                ref:'Task'
            }
        ],
        team: [ 
            {
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        ]

        
    },{timestamps:true})
    ProyectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
        const projectId = this.id
        if(!projectId) return 
        const tasks = await Task.find({project:projectId})
        for(const task of tasks){
            await Note.deleteMany({task:task._id})
        }
        await Task.deleteMany({project:projectId    })
    });    



//a este nivel, los modelos debend e tener un nombre unico que no se repita
const Project = mongoose.model<projectType>('Project',ProyectSchema)
export default Project//una vez exportando el modelo, lo podremos usar para la manipulacion de las petisiones http
