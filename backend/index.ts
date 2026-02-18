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
    // allow requests from any origin (needed when frontend may be served from many hosts)
    // keep credentials: true so cookies/session still work
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] // Explicitly allow DELETE 
}));

// debug: log incoming Origin header for troubleshooting CORS
app.use((req, res, next) => {
  console.log('>>> incoming Origin:', req.headers.origin);
  next();
});

// debug endpoint to echo Origin header
app.get('/debug/origin', (req, res) => {
  return res.json({ origin: req.headers.origin || null });
});
 
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