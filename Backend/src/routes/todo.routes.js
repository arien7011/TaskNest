import {Router} from "express";
import { createTodo, getTodo, todoList } from "../controllers/todo.controllers.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";


const TodoRouter = Router();

TodoRouter.route('/createTodo').post(verifyJWT,upload.single('attachments'),createTodo);
TodoRouter.route('/getTodo/:id').get(verifyJWT,getTodo);
TodoRouter.route('/todoList').get(todoList);
export {TodoRouter};