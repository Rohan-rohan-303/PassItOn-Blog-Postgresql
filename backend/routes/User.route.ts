import express from 'express';
import { 
    deleteUser, 
    getAllUser, 
    getUser, 
    updateUser 
} from '../controllers/User.controller';
import upload from '../config/multer';
import { authenticate } from '../middleware/authenticate';

const UserRoute: express.Router = express.Router();

UserRoute.use(authenticate);

UserRoute.get('/get-user/:userid', getUser);

UserRoute.put('/update-user/:userid', upload.single('file'), updateUser);

UserRoute.get('/get-all-user', getAllUser);

UserRoute.delete('/delete/:id', deleteUser);

export default UserRoute;