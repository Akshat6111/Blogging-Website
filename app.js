require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog")
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const path = require("path");

const connectMongoDB = require("./connection");
const checkForAuthenticationCookie = require("./middleware/authentication");

const app = express();
const PORT = process.env.PORT || 1200;

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")))

connectMongoDB(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error - ",err));


app.use("/users",userRoute);
app.use("/blog",blogRoute);
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.get("/",async (req,res) =>{
    const allBlogs = await Blog.find({});
    res.render("home.ejs",{
        user : req.user,
        blogs : allBlogs,
    });
})

app.listen(PORT,() => console.log(`Server Started At Port ${PORT}`));
