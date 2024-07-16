import { Express, Router } from "express";
import colors from 'colors'
import { body, param } from "Express-validator"
import { ProyectController } from "../controllers/ProyectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { hasAutoritation, validateTaskBelongsToProject, validateTaskExists } from "../middleware/task";
import { validateProjectExists } from "../middleware/project";
import { autenticate } from "../middleware/auth";
import Task from "../models/Tasks";
import TeamControllerMember from "../controllers/TeamControler";
import NoteController from "../controllers/NoteController";
const router = Router()


   router.use(autenticate)//!aqui sale el token para la verificacion de usuarioo
   
    router.post('/',

        body('projectName').notEmpty().withMessage('The project name is required'),
        body('clientName').notEmpty().withMessage('The client name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        handleInputErrors,
        ProyectController.createProject
    );
    router.get('/', ProyectController.getAllProjects)
    router.get('/:id', param('id').isMongoId().withMessage('it is not valid')
        , handleInputErrors
        , ProyectController.getProjectById)
   
   
     router.put('/:id',
        body('projectName').notEmpty().withMessage('The project name is required'),
        body('clientName').notEmpty().withMessage('The client name is required'),
        body('description').notEmpty().withMessage('Description is required'),
        handleInputErrors,
        ProyectController.updateProject)
    router.delete('/:id',
        body('id').isEmpty().withMessage('The id is not required'),
        handleInputErrors,
        ProyectController.deleteProject)

    /**** Routes of tasks ****/
    //este codigo es para evitar la diplciacion de codigo
    router.param('projectID',validateProjectExists)
    router.param('taskId',validateTaskExists)
    router.param('taskId',validateTaskBelongsToProject)
    //lo agregamos als rutas aqui debido a que debe haber una tarea a un proyecto ya existente




    router.post('/:projectID/tasks',
        hasAutoritation,
        body('name').notEmpty().withMessage('The name of the task is required'),
        body('description').notEmpty().withMessage('Description is required'),
        handleInputErrors,
        TaskController.createTask
    );
    router.get('/:projectID/tasks',
        TaskController.getProjectTask
    )
    router.get('/:projectID/tasks/:taskId',
    param('taskId').isMongoId().withMessage('The id is not valid'),
    TaskController.getTaskByID
)
    router.put('/:projectID/tasks/:taskId',
        hasAutoritation,
        body('name').notEmpty().withMessage('The name of the task is required'),
        body('description').notEmpty().withMessage('Description is required'),
        handleInputErrors,
        TaskController.updateTask
    )
    router.delete('/:projectID/tasks/:taskId',
        hasAutoritation,
         param('taskId').isMongoId().withMessage('The id is not valid'),
        TaskController.deleteTask
    )
    router.put('/:projectID/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('The id is not valid'),
    body('status').notEmpty().withMessage('The status is required'),
    handleInputErrors,
    TaskController.updateStateTask
    )

  /* rutas para los proyectos */
  router.post("/:project/team/find",
    body('email').isEmail().toLowerCase().withMessage('The email is not valid'),
    handleInputErrors,
    TeamControllerMember.findMemberByEmail
  )  

  router.post("/:project/team/",
    body("_id").isMongoId().withMessage('El id no es valido'),
    TeamControllerMember.addMemberById
  )

  router.delete("/:project/team/:userId",
    body("_id").isMongoId().withMessage('El id no es valido'),
    TeamControllerMember.removeMemberById,
  )
  router.get("/:project/team/",TeamControllerMember.getAllMembers)


/*ROUTES OF NOTES */
http://localhost:4000/api/projects/668609f983e54294ff4c39c0/task/668d9aee71d8c23c0213931d/notes
router.post('/projectID/:projectID/taskId/:taskId/notes',
    body('content').notEmpty().withMessage('The note is required'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/projectID/:projectID/taskId/:taskId/notes', NoteController.getTaskNotes)
router.delete('/projectID/:projectID/taskId/:taskId/notes/:noteId', 
    param("noteId").isMongoId().withMessage('The id is not valid'),
    handleInputErrors,
    NoteController.deleteNote)

export default router