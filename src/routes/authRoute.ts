import { Router } from "express";
import { body } from 'Express-validator'
import { handleInputErrors } from "../middleware/validation";
import AuthController from "../controllers/AuthController";
import { autenticate } from "../middleware/auth";

/*
  TODO: el codigo de autenticacion, estara aqui en este archivo
*/
const router = Router();
router.post('/create-account',
  body("name").notEmpty().withMessage('The name is empty'),
  body("password").isLength({ min: 8 }).withMessage('The name is empty'),
  body("email").isEmail().withMessage('The name is empty'),
  body("password_confirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('The passwords do not match')
    }
    return true
  }),
  handleInputErrors,
  AuthController.createAccount)
router.post('/confirm-account',
  body("token").notEmpty().withMessage('The token is empty'),
  AuthController.confirmAccount)
router.post('/login',
  body("email").isEmail().withMessage('The email is empty'),
  body("password").notEmpty().withMessage('The password is empty'),
  handleInputErrors,
  AuthController.login
)
router.post('/request-code',
  body("email").isEmail().withMessage('The email is empty'),
  handleInputErrors,
  AuthController.requestConfirmationAccount
)

router.post('/forgot',
  body("email").isEmail().withMessage('The email is empty'),
  handleInputErrors,
  AuthController.forgotPassword
)
router.post("/validate-token", 
  body("token").notEmpty().withMessage('The token is empty'),
  handleInputErrors, AuthController.validateToken)


  router.post("/update-password", 
    body("token").isNumeric().withMessage('Token no valido'),
    body("password").isLength({ min: 8 }).withMessage('La contraseña es muy corta'),
    body("password_confirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('The passwords do not match')
      }
      return true
    }),
  handleInputErrors, AuthController.updatePasswordWithToken)

router.get("/user",
            autenticate,
            AuthController.user
)


/*PROFDILE */

router.put("/profile",
                        autenticate,
                        body("name").notEmpty().withMessage('The name is empty'),
                        body("email").isEmail().withMessage('The name is empty'),
                        handleInputErrors,
                      AuthController.updateProfile)

router.post("/update-password/user",autenticate,
                             body("current_password").notEmpty().withMessage('No cumple con el minimo de caracteres'),
                             
                              body("password").isLength({ min: 8 }).withMessage('No cumple con el minimo de caracteres'),
                              body("password_confirmation").custom((value, { req }) => {
                                if (value !== req.body.password) {
                                  throw new Error('The passwords do not match')
                                }
                                return true
                              }),
                              handleInputErrors,
                              AuthController.updateCurrentUserPassword
)

router.post("/check-password",  
        autenticate,
        body("password").notEmpty().withMessage('La contraseña no puede ser vacia'),
        handleInputErrors,
        AuthController.checkPassword
        
 )
export default router;