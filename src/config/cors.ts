import cors from 'cors';
import { CorsOptions } from 'cors';
const corsConfig : CorsOptions = {
    origin: function(origin,callback){
        const whiteList = [process.env.FRONTEND_URL,process.env.BACKEND_URL]
    
        if(process.argv[2] === '--api'){
            whiteList.push(undefined)

        }
      
        if(whiteList.includes(origin)){
            return callback(null,true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    }
}
export default corsConfig 