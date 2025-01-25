import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser'
import cors from 'cors';
import userRouter from "./routes/usersRoutes";
import path from "path";
import categoryRouter from "./routes/categoryRoutes";
import productRouter from "./routes/productRoutes";
import publicRouter from "./routes/publicRoutes";

dotenv.config();

const port = process.env.PORT || 8000;

dotenv.config();


const app: Express = express();

app.use('/public', express.static(path.join(__dirname, '../public')));

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // Next app URL
        'http://localhost:5173', // React app URL
        'http://127.0.0.1:5173', // Another possible URL for local development
        'http://your-production-url.com' // Your production React app URL
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
    optionsSuccessStatus: 204 // Legacy browsers (IE11, various SmartTVs)
};

// Use CORS middleware
app.use(cors(corsOptions));
// Middleware to parse JSON
app.use(express.json());
// Middleware to parse body 
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

declare global {
    namespace Express {
        interface Request {
            user?: any
            token?: any;
        }
    }
}

// routes -- private for company
app.use("/api/v1/users", userRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/products", productRouter)

// routes -- public

app.use('/api/v1/public', publicRouter)




app.get("/", (req: Request, res: Response) => {
    res.json({
        status: true,
        message: 'server is running',
        port: port,
        url: `http://localhost:${port}`
    })
})
app.listen(port, async () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)

})