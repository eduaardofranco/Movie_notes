const cors = require('cors')
const express = require('express');
const routes = require('./routes');
const cookieParser = require('cookie-parser')
const AppError = require('./utils/AppError')
require('express-async-errors');
require('dotenv/config')

const database = require('./database/sqlite')
const uploadConfig = require('./configs/upload')


const app = express();
app.use(express.json());
app.use(cookieParser())

//cors to handle fron end requests
app.use(cors({
    origin: ['http://localhost:5173','https://rocketmovies20.netlify.app/'],
    credentials: true,
    // allowedHeaders: 'Content-Type, Authorization'
}))

//show avatar inside uploads folder
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes);

//create database
database()

app.use(( error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    console.error(error);

    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    })
})
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => console.warn(`server running on port ${PORT}`));