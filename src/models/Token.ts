import mongoose,{Schema, Document,Types} from 'mongoose';
export interface IToken extends Document{
    token: string;
    created: Date;  
    user:string
}
const tokenSchema:Schema = new Schema({
    token:{
        type: String,
        required: true,
        trim: true
    },
    created:{
        type: Date,
        default: Date.now(),
        expires: "10m"
    },
    user:{
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
});
 const Token = mongoose.model<IToken>('Token', tokenSchema);
 export default Token