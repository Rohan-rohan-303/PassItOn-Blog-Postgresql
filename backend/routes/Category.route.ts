import * as express from 'express';
import { 
    addCategory, 
    deleteCategory, 
    getAllCategory, 
    showCategory, 
    updateCategory 
} from '../controllers/Category.controller';
import { onlyAdmin } from '../middleware/onlyadmin'; 
const CategoryRoute: express.Router = express.Router();


CategoryRoute.post('/add', addCategory);
CategoryRoute.put('/update/:categoryid', onlyAdmin, updateCategory);
CategoryRoute.get('/show/:categoryid', onlyAdmin, showCategory);
CategoryRoute.delete('/delete/:categoryid', onlyAdmin, deleteCategory);


CategoryRoute.get('/all-category', getAllCategory);

export default CategoryRoute;