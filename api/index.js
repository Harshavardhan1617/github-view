const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const gitRequestRepos = async (usr) => {
  const res = await fetch(`https://api.github.com/users/${usr}/repos`);
  const data = await res.json();
  return data;
};

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const repos = await gitRequestRepos(`${id}`);
  res.send(repos);
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
