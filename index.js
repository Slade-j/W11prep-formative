const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");


const app = express();
const port = process.env.PORT || 3000;


app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser({ cookie: true }));
const csrfProtection = csrf( {cookie: true });

const validations = (req, res, next) => {
  const errors = [];
  const { firstName, LastName, email, password, confirmedPassword } = req.body;

  if (!firstName) errors.push("Please provide a first name.");
  if (!lastName) errors.push("Please provide a last name")

  req.errors = errors;
  next();
}


const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  res.render("index", { users });
});

app.get("/create", csrfProtection, (req, res) => {
  res.render("create-normal", { csrfToken: req.csrfToken() })
});

app.post("/create", validations, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
  const returnData = {errors: req.errors, firstName, lastName, email, password, confirmedPassword };

  if (req.errors.length) {
    res.render("create-normal", returnData);
  } else {
    const currId = users[users.length - 1].id;
    users.push({ id: currId + 1, firstName, lastName, email });
    res.redirect('/');
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
