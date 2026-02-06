require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectWithDB } = require("./db/dbConnection");
const { globalErrorHandler } = require('./utils/globalErrorHandler');
const { ApiError } = require("./utils/ApiError");

process.on('uncaughtException', (error) => {
    console.log(error.name, error.message);
    console.log("Uncaught exception! Shutting down...");
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 8000;

// CORS — allow cookies from frontend
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Fix: Required for credential cookies
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectWithDB().then(() =>
    console.log("Successfully connected with database")
);

// HOME
app.get('/', (req, res) => {
    res.send("This is home page");
});

// Routes
app.use('/auth', require('./router/auth.route'));
app.use('/cart', require('./router/cart.route'));
app.use('/products', require('./router/product.router'));
app.use('/orders', require('./router/order.route'));
app.use('/user', require('./router/user.route'));
app.use('/brand', require('./router/brand.route'));
app.use('/category', require('./router/category.route'));
app.use('/wishlist', require('./router/wishlist.route'));

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ApiError(404, `This path ${req.originalUrl} is not on the server`));
});

app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, () => {
    console.log("app running on port :", PORT);
});

// Unhandled rejection
process.on('unhandledRejection', (error) => {
    console.log(error.name, error.message);
    console.log("Unhandled rejection! Shutting down...");

    server.close(() => process.exit(1));
});
