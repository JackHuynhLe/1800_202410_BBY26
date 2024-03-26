//Import
const express = require("express");
const app = express();
const path = require("node:path")
const fs = require("node:fs")

//Static files
app.use("/images", express.static(path.resolve(__dirname, "./public/images")));
app.use("/scripts", express.static(path.resolve(__dirname, "./public/scripts")));
app.use("/styles", express.static(path.resolve(__dirname, "./public/styles")));

//Functions
/*Pages*/
//Index page

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./project/profile.html"));
});

//index page
app.get("/index", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/html/index.html"));
});

//Community page
app.get("/community", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/html/community.html"));
});
//History page
app.get("/history", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/html/history.html"));
});
//Profile page
app.get("/profile", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/html/profile.html"));
});
//Signup page
app.get("/signup", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/html/signup.html"));
});

/*Snippets of HTML*/
//Get bottom_navbar.html
app.get("/get-navbar", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/data/text/bottom_navbar.html"));
});
//Get footer.html
app.get("/get-footer", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./app/data/text/footer.html"));
});

/*Interaction*/
//Get languages
app.get("/languages/:lang", (req, res) => {
  const lang = req.params.lang;
  const languageFilePath = path.resolve(__dirname, `./app/data/languages/${lang}.json`);
  if (fs.existsSync(languageFilePath)) {
    res.sendFile(languageFilePath);
  } else {
    res.status(404).send({error: "Language file not found."});
  }
});

//Run the server
app.listen(2600, () => {
  console.log("Server is running on port 2600");
});