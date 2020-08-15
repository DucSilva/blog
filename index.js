const express = require('express')
const app = new express()
const path = require('path')
const ejs = require('ejs')
app.set('view engine', 'ejs')
const fileUpload = require('express-fileupload');


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.raw());
app.use(fileUpload());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true })

//import models
const BlogPost = require('./models/BlogPost.js')

//import controllers
const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const newUserController = require('./controllers/newUser');
const storeUserController = require('./controllers/storeUser')

//Đăng ký thư mục public.....
app.use(express.static('public'))

//Tao server
app.listen(4000, () => {
    console.log('OK. App listening on port 4000')
})


app.get('/', homeController)
app.get('/auth/register', newUserController)

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

app.get('/posts/new', newPostController);

app.post('/posts/store', (req, res) => {
    let image = req.files.image;
    image.mv(path.resolve(__dirname, 'public/upload', image.name), function (
        error) {
        BlogPost.create({
            ...req.body,
            image: '/upload/' + image.name
        }, function (err) {
            res.redirect('/')
        })
    })
});

app.post('/users/register', storeUserController);

// app.post('/posts/store', storePostController);
//middleware validate
const validateMiddleware = require("./middleware/validationMiddleware");
app.use('/posts/store', validateMiddleware)