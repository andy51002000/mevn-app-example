const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var Post = require("./models/post");

var mongoose = require('mongoose');

var url = require('./config').mongoEndpoint;
// mongoose.connect('mongodb://localhost:27017/posts');
mongoose.connect(url);

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", function(callback){

  console.log("Connection Succeeded");

});


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

//read
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

//create
app.post('/posts', (req, res) => {

  var db = req.db;

  var title = req.body.title;

  var description = req.body.description;

  var new_post = new Post({

    title: title,

    description: description

  })



  new_post.save(function (error) {

    if (error) {

      console.log(error)

    }

    res.send({

      success: true,

      message: 'Post saved successfully!'

    })

  })

})

app.get('/post/:id',(req,res)=>{
  var db = req.db;
  Post.findById(req.params.id,'title description', (err,post)=>{
    if(err){
      console.error(err)
    }
    res.send(post)
  })
})

//update
app.put('/posts/:id',(req,res) =>{
  var db = req.db;
  Post.findById(req.params.id,'title description',(err,post)=>{
    if(err){
      console.error(err);
    }

    post.title = req.body.title;
    post.description = req.body.description;
    post.save( err=>{
      if(err){
        console.log(err)
      }
      res.send({
        success:true
      })
    })
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  var db = req.db;
  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

app.listen(process.env.PORT || 8081)