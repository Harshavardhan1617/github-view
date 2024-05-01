const express = require("express");
const ejsMate = require("ejs-mate");
const app = express();
const path = require("path");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "..", "views"));
app.use(express.urlencoded({ extended: true }));

const gitRequestRepos = async (usr) => {
  const res = await fetch(`https://api.github.com/users/${usr}/repos`);
  const data = await res.json();
  if (Array.isArray(data)) {
    const mapRepos = data.map((obj) => {
      const { id, name, description, topics } = obj;
      return { id, name, description, topics };
    });
    return mapRepos;
  } else {
    const { id, name, description, topics } = data;
    return { id, name, description, topics };
  }
};

const gitRequestUser = async (usr) => {
  const res = await fetch(`https://api.github.com/users/${usr}`);
  const body = await res.json();
  const { id, avatar_url, name, location, bio, twitter_username } = body;
  const user = { id, avatar_url, name, location, bio, twitter_username };
  return user;
};

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/", async (req, res) => {
  const { query } = req.body;
  const repos = await gitRequestRepos(`${query}`);
  const user = await gitRequestUser(`${query}`);
  res.render("show", { repos, user });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
