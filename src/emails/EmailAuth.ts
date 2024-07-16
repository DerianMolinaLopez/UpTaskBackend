import transport from "../config/nodemeadler"

interface IEmailAuth{
     name:string,
     token:string,
     email:string
}

class EmailAuth{
    static async sendConfirmationEmail(user:IEmailAuth){
        await transport.sendMail({
            from: 'UpTask <derianmolina@gmail.com>',
            to: user.email,
            subject: 'Confirma tu cuenta',
            text: `Confirma tu cuenta`,
            html:`<p>
                      Hola ${user.name} para proceder, debes visitar el siguiente enlace
                  </p>
                 <a href=${process.env.FRONTEND_URL}/auth/confirm-account>Confirmar cuenta</a>
                    <p>Ingresa el codigo:</p><b>${user.token}</b>
                  `
          })
    }

    static async sendPasswordResetToken(user:IEmailAuth){
        await transport.sendMail({
            from: 'UpTask <derianmolina@gmail.com>',
            to: user.email,
            subject: 'Restablece tu contraseña',
            text:      `Restablece tu contraseña`,
            html:`<p>
                      Hola ${user.name} has solicitado reestablecer tu contraseña
                  </p>
                 <a href=${process.env.FRONTEND_URL}/auth/new-password>Establecer contraseña</a>
                    <p>Ingresa el codigo:</p><b>${user.token}</b>
                  `
          })
    }
}
export default EmailAuth;