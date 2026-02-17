import express from 'express';
import { 
    addcomment, 
    commentCount, 
    deleteComment, 
    getAllComments, 
    getComments 
} from '../controllers/Comment.controller';
import { authenticate } from '../middleware/authenticate';

const CommentRoute: express.Router = express.Router();

CommentRoute.get('/get/:blogid', getComments);
CommentRoute.get('/get-count/:blogid', commentCount);

CommentRoute.post('/add', authenticate, addcomment);
CommentRoute.get('/get-all-comment', authenticate, getAllComments);
CommentRoute.delete('/delete/:commentid', authenticate, deleteComment);

export default CommentRoute;