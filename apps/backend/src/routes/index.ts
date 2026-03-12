import { Router } from 'express';
import listTodos from './listTodos.js';
import searchTodos from './searchTodos.js';
import createTodo from './createTodo.js';
import updateTodo from './updateTodo.js';
import deleteTodo from './deleteTodo.js';

const router = Router();

router.use(searchTodos);
router.use(listTodos);
router.use(createTodo);
router.use(updateTodo);
router.use(deleteTodo);

export default router;
