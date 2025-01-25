"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const path_1 = __importDefault(require("path"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
dotenv_1.default.config();
const port = process.env.PORT || 8000;
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
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
app.use((0, cors_1.default)(corsOptions));
// Middleware to parse JSON
app.use(express_1.default.json());
// Middleware to parse body 
app.use(body_parser_1.default.json()); // Parse JSON request bodies
app.use(body_parser_1.default.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// routes -- private for company
app.use("/api/v1/users", usersRoutes_1.default);
app.use("/api/v1/categories", categoryRoutes_1.default);
app.use("/api/v1/products", productRoutes_1.default);
// routes -- public
app.use('/api/v1/public', publicRoutes_1.default);
app.get("/", (req, res) => {
    res.json({
        status: true,
        message: 'server is running',
        port: port,
        url: `http://localhost:${port}`
    });
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[server]: Server is running at http://localhost:${port}`);
}));
