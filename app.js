import express from "express";
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import passport from 'passport';
import passportConfig from './config/passport-setup.js'
import dotenv from 'dotenv'


// Initializing the app
const app = express();
passportConfig(passport);


// setting the config files
dotenv.config();


// Importing the DB Connection 
import dbConnection from './db/connectToDb.js';

const PORT = process.env.PORT || 3000;
(async () => {
    try {
        await dbConnection(process.env.MONGODB_URI);
        console.log("DB instance initialized and connected to!");
        app.listen(PORT, () => {
            console.log("Now, listening for Incoming Request!");
            console.log(`http://${process.env.HOST}:${process.env.PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
})()


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/api/v1/ping' , (req, res) => {
    res.status(200).json({
        message: "Welcome To Deliva!😍"
    })
})


// installing the middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cookieSession({
    maxAge: 60 * 60 * 24 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

//Initializing passport
app.use(passport.initialize());
app.use(passport.session());

// this is a workaround code for passport 0.6.0
app.use(function (request, response, next) {
    if (request.session && !request.session.regenerate) {
        request.session.regenerate = (cb) => {
            cb()
        }
    }
    if (request.session && !request.session.save) {
        request.session.save = (cb) => { 
            cb()
        }
    }
    next()
})


// setting the view engine
app.set('view engine', 'ejs');


// importing the Auth API routes
import authRoutes from './routes/authRoutes.js';

app.get('/', (req, res) => {
    res.send('what are you doing here')
});


app.use("/api/v1/auth/",
    // connectEnsureLogin.ensureLoggedOut({ redirectTo: "/dashboard" }),
    authRoutes);

// Importing normal API routes
import apiRoutes from './routes/index.js';
app.use('/api/v1/', apiRoutes);



app.get("*", (req, res) => {
    res.status(404).json({
        message: `Can't find ${req.originalUrl} this route`,
        additional: "do you know what tf you doing?"
    });
});

app.use((err, req, res, next) => {
    err.status = err.status || "fail";
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({ 
        status: err.status,
        message: err.message,
        field: err.field,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});
