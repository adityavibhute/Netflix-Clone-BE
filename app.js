const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const store = require('./mongoStore');
const session = require('express-session');
const userRouter = require('./routes/userRouter');
const protectedRouter = require('./routes/protectedRouter');

const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
); // Use this after the variable declaration

if(process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

app.use(
  session({
    name: "user_login_token_exist",
    secret: "user_login_token_exist",
    store: store,
    saveUninitialized: false,
    resave: false,
    cookie: {
      sameSite: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  console.log('Req from Middleware', res.body);
  req.reqTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/dashboard', protectedRouter);

module.exports = app;
