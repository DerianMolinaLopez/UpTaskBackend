import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const config = ()=>{
    return{
        host: process.env.STMTP_HOST,
        port:+ process.env.STMTP_PORT,//!es neceario el + para convertirlo a numero
        auth: {
            user: process.env.STMTP_USER ,
            pass: process.env.STMTP_PASS
         }
    }
}

const  transport = nodemailer.createTransport(config());
  export default transport;