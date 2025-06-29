const { Router } = require("express");
const router = Router();
const Comment = require("../models/comment");
const Blog = require("../models/blog");

const multer = require("multer");
const { storage } = require("../utils/cloudinary"); 
const upload = multer({ storage });

router.get("/add-new",(req,res) =>{
    res.render("addBlog.ejs",{
        user : req.user,
    });
})

router.post("/",upload.single("coverImage"),async (req,res) =>{
    const {title,body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImageUrl: req.file.path,
    })

    res.redirect(`/blog/${blog._id}`)
})

router.get("/:id",async (req,res) =>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId : req.params.id}).populate("createdBy");
  console.log(comments);
  return res.render("blog.ejs",{
  user : req.user,
  blog,
  comments,
  });
})

router.post("/comment/:blogId",async (req,res) =>{
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id,
  })

  return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;