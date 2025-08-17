import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser"

dotenv.config({
    path:'./.env'
})
const app = express();


app.use(cors({
    origin: '*',
    credentials: true
}))

app.use(express.static('public'));
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())


app.use('/',(req,res)=>{
    console.log({req:req})
    res.send(`<h1>Welcome to the Backend API! Please refer to the documentation for usage instructions.</h1>`
    )
});

//Routes import
import {userRouter} from './src/routes/user.routes.js';
import { TodoRouter } from './src/routes/todo.routes.js';

app.use('/api/v1/users',userRouter);
app.use('/api/v1/todo',TodoRouter);

export {app};