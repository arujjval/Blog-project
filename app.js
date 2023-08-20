//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');    //for this refer lodash.com, important!
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

const homeStartingContent = "Hy, this is Arujjwal. This is a blog posting website, where composing and publishing blog is super easy. Just click on the COMPOSE on top right side of navigation bar and feel free to write out your heart.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//Collection
const Blog= mongoose.model('Blog', {
  title: String,
  content: String
})

app.get('/', function(req, res){
  Blog.find({}).then(function(posts){
    res.render("home", { content: homeStartingContent, posts: posts});
  })
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.get("/posts/:Title", function(req, res){
  const title= req.params.Title
  Blog.findOne({title: title}).then(function(post){
    res.render('post', {title: post.title, content: post.content, id: post._id})
  })
})

app.post("/compose", function(req, res){
  const title=_.capitalize(req.body.title)
  const post= req.body.post
  const blog= new Blog({
    title: title,
    content: post
  })
  blog.save()
  res.redirect("/")
})

app.post('/delete', function(req, res){
  const id= req.body.deleteBtn
  Blog.deleteOne({_id: id}).then(function(data){
    res.redirect('/')
  }).catch(function(err){
    console.log(err)
  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
