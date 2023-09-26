require('express-async-errors');

const database = require('./database/sqlite')
const AppError = require('./utils/AppError')
const express = require('express');
const uploadConfig = require('./configs/upload')

const cors = require('cors')
const routes = require('./routes');

const app = express();
//cors to handle fron end requests
app.use(cors())
app.use(express.json());

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
const PORT = 3333;

app.listen(PORT, () => console.warn(`server running on port ${PORT}`));