const express = require('express');
const app = new express();
const path = require('path');
const ejs = require('ejs');
app.set('view engine', 'ejs');
const expressSession = require('express-session');

// const fileUpload = require('express-fileupload');


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.raw());
app.use(expressSession({
    secret: 'keyboard cat'
}))

//require database URL from properties file
var dbURL = require('./properties').DB;

const mongoose = require('mongoose');
mongoose.connect(dbURL, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('connected to db')
}).catch((error) => {
    console.log(error)
})

const fileUpload = require('express-fileupload')
app.use(fileUpload());

//import controllers
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutUserController = require('./controllers/logout');
//middleware validate
const validateMiddleware = require("./middleware/validationMiddleware");
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware');

//Đăng ký thư mục public.....
app.use(express.static('public'))

//Tao server
app.listen(4000, () => {
    console.log('OK. App listening on port 4000')
})

//Khai báo biến loggedIn global
global.loggedIn = null;
app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});


app.get('/', homeController);
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController);
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController);

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/post', (req, res) => {
    res.render('post');
})

app.get('/post/:id', getPostController)

app.get('/posts/new', authMiddleware, newPostController);

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);

app.post('/posts/store', storePostController);

app.use('/posts/store', authMiddleware, validateMiddleware)
app.get('/auth/logout', logoutUserController)
app.use((req, res) => res.render('notfound'));