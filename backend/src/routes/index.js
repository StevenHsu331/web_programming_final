import { Router } from 'express';
import loginController from './loginController.js';
import departmentController from './departmentController.js';
import userController from './userController.js';
import bulletinController from './bulletinController.js';
import dayOffController from './DayOffController.js';
import checkInController from './checkInController.js';

const routes = Router();
routes.use('/', loginController);
routes.use('/', departmentController);
routes.use('/', userController);
routes.use('/', bulletinController);
routes.use('/', dayOffController);
routes.use('/', checkInController);

export default routes;