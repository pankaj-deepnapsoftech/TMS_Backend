import {Router} from 'express';

// --------------- local imports -----------------
import { ChangeStatus, CreateTodo, DeleteTodo, GetAllTodo, UpdateStatus, UpdateTodo } from '../controller/Todo.controller.js';
import { Validator } from '../utils/validator.js';

// --------------- validation imports -----------------
import { StatusHistory, TodoValidationSchema } from '../validation/Todo.validation.js';


const routes = Router();

// ----------------- Todo routes -------------------
routes.route("/create").post(Validator(TodoValidationSchema),CreateTodo);
routes.route("/get").get(GetAllTodo);
routes.route("/delete/:id").delete(DeleteTodo);
routes.route("/update/:id").put(UpdateTodo);
routes.route("/change-status/:id").put(Validator(StatusHistory),ChangeStatus);
routes.route("/update-status/:id").put(UpdateStatus);



export default routes;