//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const alert = require("alert");
// const swal = require("sweetalert");
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const path = require('path')
// const swal = require("sweetalert2");


const homeStartingContent = "Writing and publishing blog posts or articles on your own website is critical to generate qualified traffic.Publishing informational content on a website blog, resource section, orContent is everywhere today. It’s insanely competitive.Did you know that over 70 million blog posts are published monthly?If you’re going to gain any real traction, you need to look beyond publishing content on your website.In addition to mainstream outlets like Medium, sharing your content on industry or niche platforms can also help it get seen by more people.Think of sharing your content on other outlets like a megaphone: the more places you promote it, the wider the message will spread.";
const aboutContent = "Medium allows you to republish your existing blog posts (if you use their import feature, they even add a rel=canonical link), but you can also use this platform as a way to increase traffic to the full blog posts on your site.";
const contactContent = "The museum comprises main hall and four galleries besides exhibits in the verandah and a few in open courtyards. Majority of the objects are from Sanchi itself and a few from its neighborhood i.e. Gulgaon, Vidisha, Murelkhurd and Gyaraspur.";
//express set up
const app = express();


app.set('view engine', 'ejs');

//mongoose
mongoose.connect('mongodb://localhost:27017/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);

// bodyParser
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.use(cookieParser('secret'));

app.use(session({
    secret: 'secret-key',
    cookie: {
        secure: true,
        maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

  //array for post in compose (app.post)
// var posts = [];

const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postsSchema);

// const post1 = new Post({
//   title:"Day schedule",
//   content: "I used to wake up at 6am. After that i use to do yoga to keep my body fit"
// });
//
// const post2 = new Post({
//   title:"night schedule",
//   content: "I used to sleep till 11pm.so that i can be able to wake up early."
// });
//
// const defaultPosts = [post1, post2];

app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts

    });
  });
});


app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/edit/:postId", (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findById({
    _id: requestedPostId
  }, function(err, post) {
    res.render("edit", {
      post: post
    });
  });
});

// app.post("/compose", function(req, res){
//   const post = {
//     title: req.body.postTitle,
//     content: req.body.postBody
//   };
//   Post.insertMany(post, function(err){
//     if (err) {
//       console.log("err");
//     } else {
//       console.log("successfully inserted");
//     }});
//   // post.save();
//   // posts.push(posts);
//   res.redirect("/");
// });

app.get('/posts/:postId', function(req, res) {
  const requestedPostId = req.params.postId;
  Post.find({
      _id: requestedPostId
    },
    function(err, posts) {
      res.render("post", {
        posts: posts
      });
    });
});


// app.post("/compose", function(req, res) {
//   const post = new Post({
//     title: req.body.postTitle,
//     content: req.body.postContent
//   });
//
//   post.save(function(err) {
//     if (!err) {
//       setTimeout(function () {
//          res.redirect("/");
//       }, 2000)
//     }
//   });
// });

// app.post("/compose" ,
//     check('postTitle').isLength({ min: 1}).withMessage("enter POST"),
//     check('postContent').isLength({ min: 1}).withMessage("enter Content")
//     , function(req, res) {
//      const errors = validationResult(req);
//      if (!errors.isEmpty()) {
//         res.render('compose',{data:errors.array()})
//     }
//     else {
//       const post = new Post({
//           title: req.body.postTitle,
//           content: req.body.postContent
//         });
//         post.save(function(err) { if (!err) {setTimeout(function () {res.redirect("/");}, 2000)});


app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  post.save(function(err) {
    if (!err) {
      setTimeout(function () {
         res.redirect("/");
      }, 2000)
    }
  });
});


// app.post("/edit/:postId", function(req, res){
//    const requestedPostId = req.params.postId;
//    // console.log(req.post.body);
//   Post.findByIdAndUpdate({
//     _id: requestedPostId
//   }, {
//     title : req.post.title,
//     content : req.post.content
//   }
// , {overwrite: true},
//     (function(err,update){
//     if (err) {
//       console.log(err);
//     }else{
//       res.redirect("/")
//   }
// }));
// });

app.post("/edit/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findByIdAndUpdate({
    _id: requestedPostId
  }, {
    title: req.body.title,
    content: req.body.content
  }, {
    overwrite: true
  }, (function(err, update) {
    if (err) {
      console.log(err);
    } else {
      // swal("EDITED SUCCESSFULLY");
      // res.redirect("/");
      setTimeout(function () {
         res.redirect("/");
      }, 2000)
    }
  }));
});


app.post("/delete", function(req, res) {
  let deletePost = req.body.delete;

  Post.findByIdAndDelete(deletePost, function(err) {
    if (!err) {
      // swal("successfully deleted", "success");
      // res.redirect("/");
      setTimeout(function () {
         res.redirect("/");
      }, 2000)

    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
