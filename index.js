const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [
  {
    id: uuidv4(),
    title: "My First Blog Post",
    username: "uday",
    content: "I love my college...",
    createdAt: new Date(),
  },
  {
    id: uuidv4(),
    title: "Another Post",
    username: "uday",
    content: "Express with EJS is awesome!",
    createdAt: new Date(),
  },
];


app.get("/", (req, res) => {
  res.redirect("/posts");
});


app.get("/posts", (req, res) => {
  
  let sortedPosts = posts.slice().sort((a, b) => b.createdAt - a.createdAt);
  res.render("index.ejs", { posts: sortedPosts });
});


app.get("/posts/create", (req, res) => {
  res.render("create.ejs");
});


app.post("/posts", (req, res) => {
  let { title, username, content } = req.body;
  let newPost = { id: uuidv4(), title, username, content, createdAt: new Date() };
  posts.push(newPost);
  res.redirect("/posts");
});


app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("show.ejs", { post });
});


app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post not found");
  res.render("edit.ejs", { post });
});


app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let { title, username, content } = req.body;
  let post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).send("Post not found");

  post.title = title;
  post.username = username;
  post.content = content;

  res.redirect(`/posts/${id}`);
});


app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => p.id !== id);
  res.redirect("/posts");
});


app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(port, () => {
  console.log(`Blog app listening at http://localhost:${port}`);
});
