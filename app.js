const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');    
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//MIDDLEWARE
if(process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) =>{
    req.requestTime =  new Date().toISOString();
    next();
});

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`route ${req.originalUrl} does not exist on this server`, 404));
})
//ERROR HANDLING 
app.use(globalErrorHandler);

module.exports = app;
