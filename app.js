// app.js
const express = require('express');
const bookRouter = require('./routes/bookRoutes');
const authRouter = require('./routes/userRoutes');
const authorRouter = require('./routes/authorRoutes');
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/authors', authorRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Something went wrong!';

  res.status(statusCode).json({
    status,
    message,
  });
});

module.exports = app;