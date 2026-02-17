import express from 'express';
import { Login, Logout, Register } from '../controllers/Auth.controller';
import { authenticate } from '../middleware/authenticate';

const AuthRoute: express.Router = express.Router();

AuthRoute.post('/register', Register);
AuthRoute.post('/login', Login);

AuthRoute.get('/logout', authenticate, Logout);

export default AuthRoute;