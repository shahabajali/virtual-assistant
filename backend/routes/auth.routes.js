import  express from 'express';
import { Login, logOut, signUp } from '../controllers/auth.controller.js';

const authRouter =  express.Router();  //  ruter select from express

authRouter.post('/signup',signUp); //  for signupt in  client 

authRouter.post('/signin',Login); //  for  signing in clent by emial and passwrod macthing
authRouter.get('/logout',logOut); //  fect cookies to backend and clear

export  default authRouter;