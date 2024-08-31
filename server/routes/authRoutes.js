import { Router } from 'express';
import { signup, login, logout } from '../controllers/user.controller.js';
const route = Router();

route.post('/signin', signup);
route.post('/login', login);
route.get('/logout', logout);

export default route;
