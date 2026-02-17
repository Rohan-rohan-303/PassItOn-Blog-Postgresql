import  express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import  cookieParser from 'cookie-parser'
import  cors from 'cors'
import AuthRoute from './routes/Auth.route'
import UserRoute from './routes/User.route'
import CategoryRoute from './routes/Category.route'
import BlogRoute from './routes/Blog.route'
import CommentRouote from './routes/Comment.route'






const PORT = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Explicitly allow DELETE 
}));
 

app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRouote)





app.listen(PORT, () => {
    console.log('Server running on port:', PORT)
})


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error.';

    console.error("SERVER ERROR:", err);

    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});