import  express from 'express';
import { askToAssistant, getCurrentUser, updateAssistant } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';


const userRouter  =  express.Router();  //  ruter select from express

 //  for  signing in client by email and passwrod macthing
userRouter.get('/current',isAuth,getCurrentUser);
userRouter.post('/update',isAuth,upload.single("assistantImage"),updateAssistant); //  fect cookies to backend and clear
userRouter.post('/asktoassistant',isAuth,askToAssistant);



// routes fror assistantupdate
export default userRouter;

